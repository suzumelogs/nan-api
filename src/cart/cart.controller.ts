import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { Role, User } from '@prisma/client';
import { AddDeviceToCartDto } from './dto/add-device-to-cart.dto';
import { UpdateDeviceToCartDto } from './dto/update-device-to-cart.dto';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all carts',
    description: 'Retrieve a list of all carts available.',
  })
  findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get cart by ID',
    description: 'Retrieve cart details by its ID.',
  })
  findOne(@Param('id') id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new cart',
    description: 'Create a new cart with the provided details.',
  })
  create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartService.create(createCartDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update cart by ID',
    description: 'Update the details of an existing cart by its ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete cart by ID',
    description: 'Delete a cart by its ID.',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.cartService.remove(id);
  }

  @Get('by-me')
  @ApiOperation({
    summary: 'Get my cart',
    description: 'Retrieve the cart associated with the current user.',
  })
  @Auth(Role.user)
  async findMyCart(@GetUser() user: User) {
    return this.cartService.findByUserId(user.id);
  }

  @Post('by-me')
  @ApiOperation({
    summary: 'Add device to my cart',
    description: "Add a specified device to the current user's cart.",
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
    summary: 'Update my cart',
    description:
      "Update the current user's cart with specified device details.",
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
    summary: 'Remove device from my cart',
    description: "Remove a specified device from the current user's cart.",
  })
  @Auth(Role.user)
  async removeDeviceFromMyCart(
    @Param('deviceId') deviceId: string,
    @GetUser() user: User,
  ) {
    return this.cartService.removeDeviceFromCart(user.id, deviceId);
  }
}
