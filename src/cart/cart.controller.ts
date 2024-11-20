import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Get('by-me')
  @ApiOperation({ summary: 'Giỏ hàng của tôi' })
  @Auth(Role.user)
  async findCartByMe(@GetUser() user: User) {
    return this.cartService.findCartByMe(user.id);
  }

  @Post('create/by-me')
  @ApiOperation({ summary: 'Thêm item vào giỏ hàng của tôi' })
  @Auth(Role.user)
  async createItemToCart(
    @GetUser() user: User,
    @Body() createItemToCartDto: CreateItemToCartDto,
  ) {
    return this.cartService.createItemToCart(user.id, createItemToCartDto);
  }

  @Patch('update/by-me')
  @ApiOperation({ summary: 'Cập nhật item trong giỏ hàng của tôi' })
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
  @ApiOperation({ summary: 'Xóa item khỏi giỏ hàng của tôi' })
  @Auth(Role.user)
  async removeItemFromCart(
    @GetUser() user: User,
    @Param('cartItemId') cartItemId: string,
  ) {
    return this.cartService.removeItem(user.id, cartItemId);
  }
}
