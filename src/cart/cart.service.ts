import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem, Equipment, EquipmentPackage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemToCartDto } from './dto/create-item-to-cart.dto';
import { RemoveItemToCartDto } from './dto/remove-item-to-cart.dto';
import { UpdateItemToCartDto } from './dto/update-item-to-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { prismaErrorHandler } from 'src/common/messages';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    try {
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

      let updatedItem;

      if (addToCartDto.equipmentId) {
        const existingItem = cart.items.find(
          (item) => item.equipmentId === addToCartDto.equipmentId,
        );

        if (existingItem) {
          updatedItem = await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: { increment: addToCartDto.quantity },
            },
          });
        } else {
          updatedItem = await this.prisma.cartItem.create({
            data: {
              cartId: cart.id,
              equipmentId: addToCartDto.equipmentId,
              quantity: addToCartDto.quantity,
              price: addToCartDto.price,
            },
          });
        }
      } else if (addToCartDto.packageId) {
        const existingItem = cart.items.find(
          (item) => item.packageId === addToCartDto.packageId,
        );

        if (existingItem) {
          updatedItem = await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: { increment: addToCartDto.quantity },
            },
          });
        } else {
          updatedItem = await this.prisma.cartItem.create({
            data: {
              cartId: cart.id,
              packageId: addToCartDto.packageId,
              quantity: addToCartDto.quantity,
              price: addToCartDto.price,
            },
          });
        }
      }

      await this.updateTotalAmount(cart.id);

      return updatedItem;
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async updateTotalAmount(cartId: string) {
    try {
      const cartItems = await this.prisma.cartItem.findMany({
        where: { cartId: cartId },
      });

      const totalAmount = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      await this.prisma.cart.update({
        where: { id: cartId },
        data: { totalAmount: totalAmount },
      });
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async removeFromCart(userId: string, removeItemDto: RemoveItemToCartDto) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart) {
        throw new NotFoundException(`Cart not found for user ${userId}`);
      }

      const itemToRemove = cart.items.find(
        (item) => item.id === removeItemDto.itemId,
      );

      if (!itemToRemove) {
        throw new NotFoundException(`Item not found in cart`);
      }

      await this.prisma.cartItem.delete({
        where: { id: removeItemDto.itemId },
      });

      await this.updateTotalAmount(cart.id);

      return { message: 'Item removed successfully' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async updateItemInCart(userId: string, updateItemDto: UpdateItemToCartDto) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart) {
        throw new NotFoundException(`Cart not found for user ${userId}`);
      }

      const itemToUpdate = cart.items.find(
        (item) => item.id === updateItemDto.itemId,
      );

      if (!itemToUpdate) {
        throw new NotFoundException(`Item not found in cart`);
      }

      const updatedItem = await this.prisma.cartItem.update({
        where: { id: updateItemDto.itemId },
        data: { quantity: updateItemDto.quantity },
      });

      await this.updateTotalAmount(cart.id);

      return updatedItem;
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getCartItems(userId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart) {
        throw new NotFoundException(`Cart not found for user ${userId}`);
      }

      return {
        items: cart.items,
        totalAmount: cart.totalAmount,
      };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async clearCart(userId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      if (!cart) {
        throw new NotFoundException(`Cart not found for user ${userId}`);
      }

      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await this.updateTotalAmount(cart.id);

      return { message: 'Cart cleared successfully' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
