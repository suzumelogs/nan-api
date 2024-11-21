import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart, Duration } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemToCartDto } from './dto/create-item-to-cart.dto';
import { UpdateItemToCartDto } from './dto/update-item-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async findItemById(id: string, type: 'equipment' | 'package') {
    const item =
      type === 'equipment'
        ? await this.prisma.equipment.findUnique({ where: { id } })
        : await this.prisma.equipmentPackage.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException(
        type === 'equipment' ? 'Không tìm thấy thiết bị' : 'Không tìm thấy gói',
      );
    }
    return item;
  }

  private calculateItemPrice(
    durationType: Duration,
    durationValue: number,
    item: { pricePerDay: number; pricePerWeek: number; pricePerMonth: number },
  ): number {
    switch (durationType) {
      case Duration.day:
        return item.pricePerDay * durationValue;
      case Duration.week:
        return item.pricePerWeek * durationValue;
      case Duration.month:
        return item.pricePerMonth * durationValue;
      default:
        throw new Error('Loại thời lượng không hợp lệ');
    }
  }

  private async calculatePrice(
    durationType: Duration,
    durationValue: number,
    equipmentId?: string,
    packageId?: string,
  ): Promise<number> {
    if (equipmentId) {
      const equipment = await this.findItemById(equipmentId, 'equipment');
      return this.calculateItemPrice(durationType, durationValue, equipment);
    }

    if (packageId) {
      const packageItem = await this.findItemById(packageId, 'package');
      return this.calculateItemPrice(durationType, durationValue, packageItem);
    }

    throw new Error(
      'Cần cung cấp ít nhất một trong equipmentId hoặc packageId',
    );
  }

  private async updateCartTotal(cartId: string) {
    const items = await this.prisma.cartItem.findMany({ where: { cartId } });
    const totalAmount = items.reduce((total, item) => total + item.price, 0);

    await this.prisma.cart.update({
      where: { id: cartId },
      data: { totalAmount },
    });
  }

  async findCartByMe(userId: string): Promise<{ data: Cart }> {
    try {
      const cart = await this.prisma.cart.findUniqueOrThrow({
        where: { userId },
        include: { items: true },
      });
      return { data: cart };
    } catch {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }
  }

  async createItemToCart(userId: string, dto: CreateItemToCartDto) {
    const { durationType, durationValue, equipmentId, packageId, quantity } =
      dto;

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          totalAmount: 0,
          items: { create: [] },
        },
        include: { items: true },
      });
    }

    const price = await this.calculatePrice(
      durationType,
      durationValue,
      equipmentId,
      packageId,
    );

    const cartItem = await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        equipmentId,
        packageId,
        quantity,
        durationType,
        durationValue,
        price: price * quantity,
      },
    });

    await this.updateCartTotal(cart.id);
    return cartItem;
  }

  async updateItemToCart(
    userId: string,
    cartItemId: string,
    dto: UpdateItemToCartDto,
  ) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng của người dùng');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new ForbiddenException(
        'Mục này không thuộc giỏ hàng của người dùng',
      );
    }

    const { durationType, durationValue, equipmentId, packageId, quantity } =
      dto;

    const price = await this.calculatePrice(
      durationType,
      durationValue,
      equipmentId,
      packageId,
    );

    const updatedCartItem = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        equipmentId,
        packageId,
        quantity,
        durationType,
        durationValue,
        price: price * quantity,
      },
    });

    await this.updateCartTotal(cart.id);
    return updatedCartItem;
  }

  async removeItem(userId: string, cartItemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new ForbiddenException('Mặt hàng không thuộc giỏ hàng này');
    }

    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
    await this.updateCartTotal(cart.id);

    return { message: 'Đã xóa thành công!' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount: 0 },
    });

    return { message: 'Giỏ hàng đã được làm sạch' };
  }
}
