import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem, Equipment, EquipmentPackage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemToCartDto } from './dto/create-item-to-cart.dto';
import { RemoveItemToCartDto } from './dto/remove-item-to-cart.dto';
import { UpdateItemToCartDto } from './dto/update-item-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private async findEquipmentById(id: string): Promise<Equipment> {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new NotFoundException('Không tìm thấy thiết bị');
    return equipment;
  }

  private async findPackageById(id: string): Promise<EquipmentPackage> {
    const equipmentPackage = await this.prisma.equipmentPackage.findUnique({
      where: { id },
    });
    if (!equipmentPackage) throw new NotFoundException('Không tìm thấy gói');
    return equipmentPackage;
  }

  async findCartByMe(userId: string): Promise<{ data: Cart }> {
    try {
      const cart = await this.prisma.cart.findUniqueOrThrow({
        where: { userId },
        include: {
          items: {
            include: {
              equipment: true,
              package: true,
            },
          },
        },
      });
      return { data: cart };
    } catch {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }
  }

  async createItemToCartByMe(
    userId: string,
    dto: CreateItemToCartDto,
  ): Promise<CartItem> {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    let item: Equipment | EquipmentPackage;
    let itemPriceDay = 0;
    let itemPriceWeek = 0;
    let itemPriceMonth = 0;

    if (dto.equipmentId) {
      const equipment = await this.findEquipmentById(dto.equipmentId);

      if (equipment.stock < dto.quantity) {
        throw new Error(
          `Số lượng thiết bị không đủ, chỉ còn ${equipment.stock} thiết bị.`,
        );
      }

      item = equipment;
      itemPriceDay = equipment.pricePerDay || 0;
      itemPriceWeek = equipment.pricePerWeek || 0;
      itemPriceMonth = equipment.pricePerMonth || 0;
    } else if (dto.packageId) {
      const equipmentPackage = await this.findPackageById(dto.packageId);

      item = equipmentPackage;
      itemPriceDay = equipmentPackage.pricePerDay || 0;
      itemPriceWeek = equipmentPackage.pricePerWeek || 0;
      itemPriceMonth = equipmentPackage.pricePerMonth || 0;
    } else {
      throw new NotFoundException('Không tìm thấy thiết bị hoặc gói.');
    }

    const totalPriceDay = itemPriceDay * dto.quantity;
    const totalPriceWeek = itemPriceWeek * dto.quantity;
    const totalPriceMonth = itemPriceMonth * dto.quantity;

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        equipmentId: dto.equipmentId || undefined,
        packageId: dto.packageId || undefined,
      },
    });

    let cartItem: CartItem;
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + dto.quantity;

      if (dto.equipmentId && (item as Equipment).stock < newQuantity) {
        throw new Error(
          `Số lượng thiết bị không đủ. Chỉ còn ${(item as Equipment).stock} thiết bị.`,
        );
      }

      cartItem = await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          priceDay: itemPriceDay * newQuantity,
          priceWeek: itemPriceWeek * newQuantity,
          priceMonth: itemPriceMonth * newQuantity,
        },
      });

      await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          totalAmountDay: { increment: totalPriceDay },
          totalAmountWeek: { increment: totalPriceWeek },
          totalAmountMonth: { increment: totalPriceMonth },
        },
      });
    } else {
      cartItem = await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          equipmentId: dto.equipmentId || undefined,
          packageId: dto.packageId || undefined,
          quantity: dto.quantity,
          priceDay: totalPriceDay,
          priceWeek: totalPriceWeek,
          priceMonth: totalPriceMonth,
        },
      });

      await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          totalAmountDay: cart.totalAmountDay + totalPriceDay,
          totalAmountWeek: cart.totalAmountWeek + totalPriceWeek,
          totalAmountMonth: cart.totalAmountMonth + totalPriceMonth,
        },
      });
    }

    return cartItem;
  }

  async updateQuantityByMe(
    userId: string,
    dto: UpdateItemToCartDto,
  ): Promise<CartItem> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: dto.cartItemId },
      include: {
        equipment: true,
        package: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');
    }

    let item: Equipment | EquipmentPackage;
    let itemPriceDay = 0;
    let itemPriceWeek = 0;
    let itemPriceMonth = 0;

    if (cartItem.equipmentId) {
      item = cartItem.equipment;
      itemPriceDay = item.pricePerDay || 0;
      itemPriceWeek = item.pricePerWeek || 0;
      itemPriceMonth = item.pricePerMonth || 0;
    } else if (cartItem.packageId) {
      item = cartItem.package;
      itemPriceDay = item.pricePerDay || 0;
      itemPriceWeek = item.pricePerWeek || 0;
      itemPriceMonth = item.pricePerMonth || 0;
    } else {
      throw new NotFoundException('Không tìm thấy thiết bị hoặc gói.');
    }

    if (cartItem.equipmentId && (item as Equipment).stock < dto.newQuantity) {
      throw new Error(
        `Số lượng thiết bị không đủ. Chỉ còn ${(item as Equipment).stock} thiết bị.`,
      );
    }

    const oldQuantity = cartItem.quantity;
    const totalPriceDay = itemPriceDay * dto.newQuantity;
    const totalPriceWeek = itemPriceWeek * dto.newQuantity;
    const totalPriceMonth = itemPriceMonth * dto.newQuantity;

    const differenceQuantity = dto.newQuantity - oldQuantity;
    const differenceDay = itemPriceDay * differenceQuantity;
    const differenceWeek = itemPriceWeek * differenceQuantity;
    const differenceMonth = itemPriceMonth * differenceQuantity;

    const updatedCartItem = await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: dto.newQuantity,
        priceDay: totalPriceDay,
        priceWeek: totalPriceWeek,
        priceMonth: totalPriceMonth,
      },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        totalAmountDay: cart.totalAmountDay + differenceDay,
        totalAmountWeek: cart.totalAmountWeek + differenceWeek,
        totalAmountMonth: cart.totalAmountMonth + differenceMonth,
      },
    });

    return updatedCartItem;
  }

  async removeItemToCartByMe(
    userId: string,
    dto: RemoveItemToCartDto,
  ): Promise<{ message: string }> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: dto.cartItemId },
      include: {
        equipment: true,
        package: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy mục trong giỏ hàng');
    }

    let itemPriceDay = 0;
    let itemPriceWeek = 0;
    let itemPriceMonth = 0;

    if (cartItem.equipmentId) {
      const equipment = cartItem.equipment;
      itemPriceDay = equipment.pricePerDay || 0;
      itemPriceWeek = equipment.pricePerWeek || 0;
      itemPriceMonth = equipment.pricePerMonth || 0;
    } else if (cartItem.packageId) {
      const equipmentPackage = cartItem.package;
      itemPriceDay = equipmentPackage.pricePerDay || 0;
      itemPriceWeek = equipmentPackage.pricePerWeek || 0;
      itemPriceMonth = equipmentPackage.pricePerMonth || 0;
    } else {
      throw new NotFoundException('Không tìm thấy thiết bị hoặc gói.');
    }

    const totalPriceDay = itemPriceDay * cartItem.quantity;
    const totalPriceWeek = itemPriceWeek * cartItem.quantity;
    const totalPriceMonth = itemPriceMonth * cartItem.quantity;

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        totalAmountDay: cart.totalAmountDay - totalPriceDay,
        totalAmountWeek: cart.totalAmountWeek - totalPriceWeek,
        totalAmountMonth: cart.totalAmountMonth - totalPriceMonth,
      },
    });

    return { message: 'Mục đã được xóa khỏi giỏ hàng' };
  }

  async clearCartByMe(userId: string) {
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
      data: {
        totalAmountDay: 0,
        totalAmountWeek: 0,
        totalAmountMonth: 0,
      },
    });

    return { message: 'Giỏ hàng đã được làm sạch' };
  }
}
