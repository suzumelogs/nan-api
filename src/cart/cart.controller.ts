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
import { Role, User } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CartService } from './cart.service';
import { AddDeviceToCartDto } from './dto/add-device-to-cart.dto';
import { CartFilterDto } from './dto/cart-filter.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateDeviceToCartDto } from './dto/update-device-to-cart.dto';
import { Cart } from './entities/cart.entity';

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

  @Get('by-me')
  @ApiOperation({
    summary: 'Lấy giỏ hàng của tôi',
  })
  @Auth(Role.user)
  async findMyCart(@GetUser() user: User) {
    return this.cartService.findByUserId(user.id);
  }

  @Post('by-me')
  @ApiOperation({
    summary: 'Tạo mới thiết bị trong giỏ hàng của tôi',
  })
  @Auth(Role.user)
  async addDeviceToMyCart(
    @GetUser() user: User,
    @Body() dto: AddDeviceToCartDto,
  ): Promise<Cart> {
    return this.cartService.addDeviceToCart(user.id, dto);
  }

  @Patch('by-me')
  @ApiOperation({
    summary: 'Cập nhật thiết bị trong giỏ hàng của tôi',
  })
  @Auth(Role.user)
  async updateDeviceToCart(
    @GetUser() user: User,
    @Body() dto: UpdateDeviceToCartDto,
  ): Promise<Cart> {
    return this.cartService.updateDeviceToCart(user.id, dto);
  }

  @Delete('by-me/:deviceId')
  @ApiOperation({
    summary: 'Xóa thiết bị trong giỏ hàng của tôi',
  })
  @Auth(Role.user)
  async removeDeviceFromMyCart(
    @Param('deviceId') deviceId: string,
    @GetUser() user: User,
  ) {
    return this.cartService.removeDeviceFromCart(user.id, deviceId);
  }
}
