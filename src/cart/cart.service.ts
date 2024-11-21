import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cart, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartFilterDto } from './dto/cart-filter.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

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
          include: { cartItems: true },
        }),
        this.prisma.cart.count({ where: whereClause }),
      ]);

      return { data, total, page, limit };
    } catch {
      throw new InternalServerErrorException(
        'Không thể lấy danh sách giỏ hàng',
      );
    }
  }

  async findCartByUser(userId: string): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              device: true,
              package: true,
            },
          },
        },
      });

      if (!cart) {
        throw new NotFoundException(
          'Giỏ hàng không tồn tại cho người dùng này',
        );
      }

      return cart;
    } catch {
      throw new InternalServerErrorException(
        'Không thể tìm giỏ hàng của người dùng',
      );
    }
  }

  async addItemToCart(userId: string, dto: CreateCartDto) {
    try {
      const { deviceId, packageId, quantity } = dto;

      if (deviceId && packageId) {
        throw new InternalServerErrorException(
          'Không thể thêm cả thiết bị và gói cùng một lúc',
        );
      }

      let cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await this.prisma.cart.create({ data: { userId } });
      }

      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          OR: [{ deviceId }, { packageId }],
        },
      });

      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
        return { message: 'Cập nhật số lượng mục trong giỏ hàng thành công' };
      }

      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          deviceId,
          packageId,
          quantity,
        },
      });

      return { message: 'Thêm mục vào giỏ hàng thành công' };
    } catch {
      throw new InternalServerErrorException('Không thể thêm mục vào giỏ hàng');
    }
  }

  async updateCartItem(dto: UpdateCartDto) {
    try {
      const { cartItemId, newQuantity } = dto;

      const cartItem = await this.prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });
      if (!cartItem) {
        throw new NotFoundException('Mục giỏ hàng không tồn tại');
      }

      await this.prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: newQuantity },
      });

      return { message: 'Cập nhật mục giỏ hàng thành công' };
    } catch {
      throw new InternalServerErrorException('Không thể cập nhật mục giỏ hàng');
    }
  }

  async removeItemFromCart(cartItemId: string) {
    try {
      const cartItem = await this.prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });
      if (!cartItem) {
        throw new NotFoundException('Mục giỏ hàng không tồn tại');
      }

      await this.prisma.cartItem.delete({ where: { id: cartItemId } });
      return { message: 'Xóa mục khỏi giỏ hàng thành công' };
    } catch {
      throw new InternalServerErrorException('Không thể xóa mục khỏi giỏ hàng');
    }
  }
}
