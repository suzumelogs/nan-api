import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDeviceToCartDto } from './dto/add-device-to-cart.dto';
import { CartFilterDto } from './dto/cart-filter.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateDeviceToCartDto } from './dto/update-device-to-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<CartFilterDto>,
  ): Promise<{ data: Cart[]; total: number; page: number; limit: number }> {
    try {
      const whereClause: Prisma.CartWhereInput = {
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.rentalDuration && {
          rentalDuration: filters.rentalDuration,
        }),
        ...(filters.totalPrice && { totalPrice: filters.totalPrice }),
      };

      const [data, total] = await Promise.all([
        this.prisma.cart.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
            devices: true,
          },
        }),
        this.prisma.cart.count({
          where: whereClause,
        }),
      ]);

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve carts with pagination and filters',
      );
    }
  }

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

  async findByUserId(userId: string): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { devices: true },
      });

      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }

      return cart;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user cart');
    }
  }

  async addDeviceToCart(
    userId: string,
    dto: AddDeviceToCartDto,
  ): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { devices: true },
      });

      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }

      const updatedCart = await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          devices: {
            connect: { id: dto.deviceId },
          },
        },
        include: { devices: true },
      });

      return updatedCart;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add device to cart');
    }
  }

  async updateDeviceToCart(
    userId: string,
    dto: UpdateDeviceToCartDto,
  ): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { devices: true },
      });

      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }

      const updatedCart = await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          ...dto,
        },
        include: { devices: true },
      });

      return updatedCart;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update cart');
    }
  }

  async removeDeviceFromCart(userId: string, deviceId: string): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { devices: true },
      });

      if (!cart) {
        throw new NotFoundException('Cart not found for this user');
      }

      const deviceExists = cart.devices.some(
        (device) => device.id === deviceId,
      );
      if (!deviceExists) {
        throw new NotFoundException('Device not found in cart');
      }

      const updatedCart = await this.prisma.cart.update({
        where: { id: cart.id },
        data: {
          devices: {
            disconnect: { id: deviceId },
          },
        },
        include: { devices: true },
      });

      return updatedCart;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to remove device from cart',
      );
    }
  }
}
