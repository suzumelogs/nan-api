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

  private async calculatePrice(
    durationType: Duration,
    durationValue: number,
    equipmentId?: string,
    packageId?: string,
  ): Promise<number> {
    let price = 0;

    if (equipmentId) {
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: equipmentId },
      });
      if (!equipment) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }

      price = this.getPriceByDuration(durationType, durationValue, equipment);
    }

    if (packageId) {
      const packageItem = await this.prisma.equipmentPackage.findUnique({
        where: { id: packageId },
      });
      if (!packageItem) {
        throw new NotFoundException('Không tìm thấy gói');
      }

      price = this.getPriceByDuration(durationType, durationValue, packageItem);
    }

    return price;
  }

  private getPriceByDuration(
    durationType: Duration,
    durationValue: number,
    item: any,
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

  async findCartByMe(userId: string): Promise<{ data: Cart }> {
    try {
      const cart = await this.prisma.cart.findUniqueOrThrow({
        where: { userId },
        include: { items: true },
      });
      return { data: cart };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }
  }

  async createItemToCart(
    userId: string,
    createItemToCartDto: CreateItemToCartDto,
  ) {
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

    const { durationType, durationValue, equipmentId, packageId, quantity } =
      createItemToCartDto;

    const price = await this.calculatePrice(
      durationType,
      durationValue,
      equipmentId,
      packageId,
    );

    const totalItemPrice = price * quantity;

    const cartItem = await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        equipmentId,
        packageId,
        quantity,
        durationType,
        durationValue,
        price: totalItemPrice,
      },
    });

    const totalAmount =
      cart.items.reduce((total, item) => total + item.price, 0) +
      totalItemPrice;

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount },
    });

    return cartItem;
  }

  async updateItemToCart(
    userId: string,
    cartItemId: string,
    updateItemToCartDto: UpdateItemToCartDto,
  ) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng của người dùng');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');
    }

    if (cartItem.cartId !== cart.id) {
      throw new ForbiddenException(
        'Mục này không thuộc giỏ hàng của người dùng',
      );
    }

    const { durationType, durationValue, equipmentId, packageId, quantity } =
      updateItemToCartDto;

    const newPrice = await this.calculatePrice(
      durationType,
      durationValue,
      equipmentId,
      packageId,
    );
    const newTotalItemPrice = newPrice * quantity;

    const updatedCartItem = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        equipmentId,
        packageId,
        quantity,
        durationType,
        durationValue,
        price: newTotalItemPrice,
      },
    });

    const updatedTotalAmount =
      cart.items.reduce((total, item) => total + item.price, 0) -
      cartItem.price +
      newTotalItemPrice;

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount: updatedTotalAmount },
    });

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

    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy mục giỏ hàng');
    }

    if (cartItem.cartId !== cart.id) {
      throw new Error('Mặt hàng trong giỏ hàng không thuộc về giỏ hàng này');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    const updatedItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });

    const totalAmount = updatedItems.reduce(
      (total, item) => total + item.price,
      0,
    );

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount },
    });

    return { message: 'Đã xóa thành công!' };
  }
}
