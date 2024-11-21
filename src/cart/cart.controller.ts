import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Cart, Role, User } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CartService } from './cart.service';
import { CartFilterDto } from './dto/cart-filter.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('pagination')
  @ApiOperation({
    summary: 'Lấy tất cả giỏ hàng (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: CartFilterDto,
  ): Promise<{ data: Cart[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.cartService.findAllPagination(page, limit, filters);
  }

  @Get('by-me')
  @ApiOperation({
    summary: 'Lấy thông tin giỏ hàng của tôi',
  })
  @Auth(Role.user)
  async findCartByUser(@GetUser() user: User): Promise<Cart> {
    return this.cartService.findCartByUser(user.id);
  }

  @Post('by-me')
  @ApiOperation({
    summary: 'Thêm thiết bị hoặc gói vào giỏ hàng',
  })
  @Auth(Role.user)
  async addItemToCart(
    @GetUser() user: User,
    @Body() createCartDto: CreateCartDto,
  ): Promise<{ message: string }> {
    return this.cartService.addItemToCart(user.id, createCartDto);
  }

  @Put('quantity')
  @ApiOperation({
    summary: 'Cập nhật số lượng thiết bị hoặc gói trong giỏ hàng',
  })
  async updateCartItem(
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<{ message: string }> {
    return this.cartService.updateCartItem(updateCartDto);
  }

  @Delete('remove/:cartItemId')
  @ApiOperation({
    summary: 'Xóa mục khỏi giỏ hàng',
  })
  async removeItemFromCart(
    @Param('cartItemId') cartItemId: string,
  ): Promise<{ message: string }> {
    return this.cartService.removeItemFromCart(cartItemId);
  }
}
