import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Cart, User } from '@prisma/client';

import { Auth, GetUser } from 'src/auth/decorators';
import { CartService } from './cart.service';
import { AddDeviceToCartDto } from './dto/add-device-to-cart.dto';
import { CartFilterDto } from './dto/cart-filter.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { RemoveDeviceFromCartDto } from './dto/remove-device-from-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddPackageToCartDto } from './dto/add-package-to-cart.dto';
import { RemovePackageFromCartDto } from './dto/remove-package-from-cart.dto';

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

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả giỏ hàng (Không phân trang)',
  })
  findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy giỏ hàng theo ID',
  })
  findOne(@Param('id') id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo giỏ hàng mới',
  })
  create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartService.create(createCartDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật giỏ hàng theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa giỏ hàng theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.cartService.remove(id);
  }

  @Get('me/all')
  @ApiOperation({
    summary: 'Lấy tất cả giỏ hàng của tôi',
  })
  @Auth('user')
  async findCartByUser(@GetUser() user: User): Promise<Cart> {
    return this.cartService.findCartByUser(user.id);
  }

  @Post('me/add-device')
  @ApiOperation({
    summary: 'Thêm thiết bị vào giỏ hàng của tôi',
  })
  @Auth('user')
  async addDeviceToCart(
    @GetUser() user: User,
    @Body() addDeviceToCartDto: AddDeviceToCartDto,
  ): Promise<{ message: string }> {
    return this.cartService.addDeviceToCart(user.id, addDeviceToCartDto);
  }

  @Delete('me/remove-device')
  @ApiOperation({
    summary: 'Xóa thiết bị khỏi giỏ hàng của tôi',
  })
  @Auth('user')
  async removeDeviceFromCart(
    @GetUser() user: User,
    @Body() removeDeviceFromCartDto: RemoveDeviceFromCartDto,
  ): Promise<{ message: string }> {
    return this.cartService.removeDeviceFromCart(
      user.id,
      removeDeviceFromCartDto,
    );
  }

  @Post('me/add-package')
  @ApiOperation({
    summary: 'Thêm gói thiết bị vào giỏ hàng của tôi',
  })
  @Auth('user')
  async addPackageToCart(
    @GetUser() user: User,
    @Body() addPackageToCartDto: AddPackageToCartDto,
  ): Promise<{ message: string }> {
    return this.cartService.addPackageToCart(user.id, addPackageToCartDto);
  }

  @Delete('me/remove-package')
  @ApiOperation({
    summary: 'Xóa gói thiết bị khỏi giỏ hàng của tôi',
  })
  @Auth('user')
  async removePackageFromCart(
    @GetUser() user: User,
    @Body() removePackageFromCartDto: RemovePackageFromCartDto,
  ): Promise<{ message: string }> {
    return this.cartService.removePackageFromCart(
      user.id,
      removePackageFromCartDto,
    );
  }
}
