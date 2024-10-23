import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { AddDeviceToCartDto } from './dto/add-device-to-cart.dto';
import { UpdateDeviceToCartDto } from './dto/update-device-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Cart[]> {
    try {
      return await this.prisma.cart.findMany({
        include: {
          devices: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve carts');
    }
  }

  async findOne(id: string): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUniqueOrThrow({
        where: { id },
        include: {
          devices: true,
        },
      });
      return cart;
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async create(dto: CreateCartDto): Promise<Cart> {
    try {
      const newCart = await this.prisma.cart.create({
        data: dto,
        include: {
          devices: true,
        },
      });
      return newCart;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create cart');
    }
  }

  async update(id: string, dto: UpdateCartDto): Promise<Cart> {
    try {
      const updatedCart = await this.prisma.cart.update({
        where: { id },
        data: dto,
        include: {
          devices: true,
        },
      });
      return updatedCart;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Cart not found');
      }
      throw new InternalServerErrorException('Failed to update cart');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.cart.delete({
        where: { id },
      });
      return { message: 'Cart deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async findCartByUserId(userId: string): Promise<Cart[]> {
    try {
      return await this.prisma.cart.findMany({
        where: { userId },
        include: {
          devices: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to retrieve carts for user',
      );
    }
  }

  async addDeviceToCartByMe(
    userId: string,
    dto: AddDeviceToCartDto,
  ): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUniqueOrThrow({
        where: { userId },
      });

      const updatedCart = await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          devices: {
            connect: { id: dto.deviceId },
          },
        },
        include: {
          devices: true,
        },
      });

      return updatedCart;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Cart not found');
      }
      throw new InternalServerErrorException('Failed to add device to cart');
    }
  }

  async updateDeviceToCartByMe(
    userId: string,
    dto: UpdateDeviceToCartDto,
  ): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUniqueOrThrow({
        where: { userId },
      });

      const updatedCart = await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          devices: {
            set: dto.devices.map((deviceId) => ({ id: deviceId })),
          },
        },
        include: {
          devices: true,
        },
      });

      return updatedCart;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Cart not found');
      }
      throw new InternalServerErrorException('Failed to update cart');
    }
  }

  async removeDeviceFromCartByMe(
    userId: string,
    deviceId: string,
  ): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUniqueOrThrow({
        where: { userId },
        include: {
          devices: true,
        },
      });

      const updatedCart = await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          devices: {
            disconnect: { id: deviceId },
          },
        },
        include: {
          devices: true,
        },
      });

      return updatedCart;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Cart not found');
      }
      throw new InternalServerErrorException(
        'Failed to remove device from cart',
      );
    }
  }
}
