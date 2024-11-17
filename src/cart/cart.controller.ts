import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { CartService } from './cart.service';
import { CreateItemToCartDto } from './dto/create-item-to-cart.dto';
import { UpdateItemToCartDto } from './dto/update-item-to-cart.dto';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('create-item')
  @ApiOperation({ summary: 'Thêm item vào giỏ hàng' })
  @Auth(Role.user)
  async createItemToCart(
    @GetUser() user: User,
    @Body() createItemToCartDto: CreateItemToCartDto,
  ) {
    return this.cartService.createItemToCart(user.id, createItemToCartDto);
  }

  @Patch('update-item')
  @ApiOperation({ summary: 'Cập nhật item trong giỏ hàng' })
  @Auth(Role.user)
  async updateItemToCart(
    @GetUser() user: User,
    @Body() updateItemToCartDto: UpdateItemToCartDto,
  ) {
    return this.cartService.updateItemToCart(
      user.id,
      updateItemToCartDto.cartItemId,
      updateItemToCartDto,
    );
  }

  @Delete('remove-item/:cartItemId')
  @ApiOperation({ summary: 'Xóa item khỏi giỏ hàng' })
  @Auth(Role.user)
  async removeItemFromCart(
    @GetUser() user: User,
    @Param('cartItemId') cartItemId: string,
  ) {
    return this.cartService.removeItem(user.id, cartItemId);
  }
}
