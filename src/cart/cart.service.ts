import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cart, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDeviceToCartDto } from './dto/add-device-to-cart.dto';
import { CartFilterDto } from './dto/cart-filter.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveDeviceFromCartDto } from './dto/remove-device-from-cart.dto';
import { AddPackageToCartDto } from './dto/add-package-to-cart.dto';
import { RemovePackageFromCartDto } from './dto/remove-package-from-cart.dto';

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
      };

      const [data, total] = await Promise.all([
        this.prisma.cart.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            cartItems: true,
          },
        }),
        this.prisma.cart.count({
          where: whereClause,
        }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
      throw new InternalServerErrorException(
        'Không thể lấy danh sách giỏ hàng',
      );
    }
  }

  async findAll(): Promise<Cart[]> {
    try {
      return await this.prisma.cart.findMany({
        include: {
          cartItems: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Không thể lấy danh sách giỏ hàng',
      );
    }
  }

  async findOne(id: string): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUniqueOrThrow({
        where: { id },
        include: {
          cartItems: true,
        },
      });
      return cart;
    } catch (error) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }
  }

  async create(dto: CreateCartDto): Promise<Cart> {
    try {
      const newCart = await this.prisma.cart.create({
        data: dto,
        include: {
          cartItems: true,
        },
      });
      return newCart;
    } catch (error) {
      throw new InternalServerErrorException('Không thể tạo giỏ hàng');
    }
  }

  async update(id: string, dto: UpdateCartDto): Promise<Cart> {
    try {
      const updatedCart = await this.prisma.cart.update({
        where: { id },
        data: dto,
        include: {
          cartItems: true,
        },
      });
      return updatedCart;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Không tìm thấy giỏ hàng');
      }
      throw new InternalServerErrorException('Không thể cập nhật giỏ hàng');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.cart.delete({
        where: { id },
      });
      return { message: 'Xóa giỏ hàng thành công' };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }
  }

  async findCartByUser(userId: string): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            device: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng cho người dùng này');
    }

    return cart;
  }

  async addDeviceToCart(
    userId: string,
    addDeviceToCartDto: AddDeviceToCartDto,
  ) {
    const { deviceId, quantity } = addDeviceToCartDto;

    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });
    if (!device) {
      throw new NotFoundException('Không tìm thấy thiết bị');
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          cartItems: {
            create: {
              deviceId,
              quantity,
            },
          },
        },
        include: { cartItems: true },
      });
    } else {
      const existingCartItem = cart.cartItems.find(
        (item) => item.deviceId === deviceId,
      );
      if (existingCartItem) {
        await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            deviceId,
            quantity,
          },
        });
      }
    }

    return { message: 'Thêm thiết bị vào giỏ hàng thành công' };
  }

  async removeDeviceFromCart(
    userId: string,
    removeDeviceFromCartDto: RemoveDeviceFromCartDto,
  ) {
    const { deviceId } = removeDeviceFromCartDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    const cartItem = cart.cartItems.find((item) => item.deviceId === deviceId);
    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy thiết bị trong giỏ hàng');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return { message: 'Xóa thiết bị khỏi giỏ hàng thành công' };
  }

  async addPackageToCart(
    userId: string,
    addPackageToCartDto: AddPackageToCartDto,
  ) {
    const { packageId, quantity } = addPackageToCartDto;

    const packageService = await this.prisma.package.findUnique({
      where: { id: packageId },
    });
    if (!packageService) {
      throw new NotFoundException('Không tìm thấy gói thiết bị');
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          cartItems: {
            create: {
              packageId,
              quantity,
            },
          },
        },
        include: { cartItems: true },
      });
    } else {
      const existingCartItem = cart.cartItems.find(
        (item) => item.packageId === packageId,
      );

      if (existingCartItem) {
        await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            packageId,
            quantity,
          },
        });
      }
    }

    return { message: 'Thêm gói thiết bị vào giỏ hàng thành công' };
  }

  async removePackageFromCart(
    userId: string,
    removePackageFromCartDto: RemovePackageFromCartDto,
  ) {
    const { packageId } = removePackageFromCartDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.packageId === packageId,
    );
    if (!cartItem) {
      throw new NotFoundException('Không tìm thấy gói thiết bị trong giỏ hàng');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return { message: 'Xóa gói thiết bị khỏi giỏ hàng thành công' };
  }
}
