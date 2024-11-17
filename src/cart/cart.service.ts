import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemToCartDto } from './dto/create-item-to-cart.dto';
import { UpdateItemToCartDto } from './dto/update-item-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async createItemToCart(
    userId: string,
    createItemToCartDto: CreateItemToCartDto,
  ) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId: userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: userId,
          totalAmount: 0,
          items: {
            create: [],
          },
        },
        include: { items: true },
      });
    }

    let price = createItemToCartDto.price;

    if (createItemToCartDto.equipmentId) {
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: createItemToCartDto.equipmentId },
      });
      if (!equipment) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }

      switch (createItemToCartDto.durationType) {
        case 'day':
          price = equipment.pricePerDay * createItemToCartDto.durationValue;
          break;
        case 'week':
          price = equipment.pricePerWeek * createItemToCartDto.durationValue;
          break;
        case 'month':
          price = equipment.pricePerMonth * createItemToCartDto.durationValue;
          break;
        default:
          throw new Error('Loại thời lượng không hợp lệ');
      }
    }

    if (createItemToCartDto.packageId) {
      const packageItem = await this.prisma.equipmentPackage.findUnique({
        where: { id: createItemToCartDto.packageId },
      });
      if (!packageItem) {
        throw new NotFoundException('Không tìm thấy gói');
      }

      switch (createItemToCartDto.durationType) {
        case 'day':
          price = packageItem.pricePerDay * createItemToCartDto.durationValue;
          break;
        case 'week':
          price = packageItem.pricePerWeek * createItemToCartDto.durationValue;
          break;
        case 'month':
          price = packageItem.pricePerMonth * createItemToCartDto.durationValue;
          break;
        default:
          throw new Error('Loại thời lượng không hợp lệ');
      }
    }

    const cartItem = await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        equipmentId: createItemToCartDto.equipmentId,
        packageId: createItemToCartDto.packageId,
        quantity: createItemToCartDto.quantity,
        durationType: createItemToCartDto.durationType,
        durationValue: createItemToCartDto.durationValue,
        price: price,
      },
    });

    const totalAmount =
      cart.items.reduce((total, item) => total + item.price, 0) + price;
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
    const cart = await this.prisma.cart.findUnique({
      where: { userId: userId },
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

    let price = updateItemToCartDto.price;

    if (updateItemToCartDto.equipmentId) {
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: updateItemToCartDto.equipmentId },
      });
      if (!equipment) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }

      switch (updateItemToCartDto.durationType) {
        case 'day':
          price = equipment.pricePerDay * updateItemToCartDto.durationValue;
          break;
        case 'week':
          price = equipment.pricePerWeek * updateItemToCartDto.durationValue;
          break;
        case 'month':
          price = equipment.pricePerMonth * updateItemToCartDto.durationValue;
          break;
        default:
          throw new Error('Loại thời lượng không hợp lệ');
      }
    }

    if (updateItemToCartDto.packageId) {
      const packageItem = await this.prisma.equipmentPackage.findUnique({
        where: { id: updateItemToCartDto.packageId },
      });
      if (!packageItem) {
        throw new NotFoundException('Không tìm thấy gói');
      }

      switch (updateItemToCartDto.durationType) {
        case 'day':
          price = packageItem.pricePerDay * updateItemToCartDto.durationValue;
          break;
        case 'week':
          price = packageItem.pricePerWeek * updateItemToCartDto.durationValue;
          break;
        case 'month':
          price = packageItem.pricePerMonth * updateItemToCartDto.durationValue;
          break;
        default:
          throw new Error('Loại thời lượng không hợp lệ');
      }
    }

    const updatedCartItem = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: updateItemToCartDto.quantity,
        durationType: updateItemToCartDto.durationType,
        durationValue: updateItemToCartDto.durationValue,
        price: price,
      },
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

    return updatedCartItem;
  }

  async removeItem(userId: string, cartItemId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId: userId },
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
