import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { CartService } from './cart.service';
import { CreateItemToCartDto } from './dto/create-item-to-cart.dto';
import { RemoveItemToCartDto } from './dto/remove-item-to-cart.dto';
import { UpdateItemToCartDto } from './dto/update-item-to-cart.dto';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('by-me')
  @ApiOperation({ summary: 'Giỏ hàng của tôi' })
  @Auth(Role.user)
  async findCartByMe(@GetUser() user: User) {
    return this.cartService.findCartByMe(user.id);
  }

  @Post('create/by-me')
  @ApiOperation({ summary: 'Thêm item vào giỏ hàng của tôi' })
  @Auth(Role.user)
  async createItemToCartByMe(
    @GetUser() user: User,
    @Body() dto: CreateItemToCartDto,
  ) {
    return this.cartService.createItemToCartByMe(user.id, dto);
  }

  @Patch('update/quantity/by-me')
  @ApiOperation({ summary: 'Cập nhật số lương item' })
  @Auth(Role.user)
  async updateQuantityByMe(
    @GetUser() user: User,
    @Body() dto: UpdateItemToCartDto,
  ) {
    return this.cartService.updateQuantityByMe(user.id, dto);
  }

  @Delete('remove/by-me')
  @ApiOperation({ summary: 'Xóa item' })
  @Auth(Role.user)
  async removeItemToCartByMe(
    @GetUser() user: User,
    @Body() dto: RemoveItemToCartDto,
  ) {
    return this.cartService.removeItemToCartByMe(user.id, dto);
  }

  @Delete('clear/by-me')
  @ApiOperation({ summary: 'Xóa hết item' })
  @Auth(Role.user)
  async clearCartByMe(@GetUser() user: User) {
    return this.cartService.clearCartByMe(user.id);
  }
}
