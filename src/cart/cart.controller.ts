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
    summary: 'Get current user cart',
    description: 'Retrieve the shopping cart of the authenticated user',
  })
  @Auth(Role.user)
  findCartByUserId(@GetUser() user: User) {
    return this.cartService.findCartByUserId(user.id);
  }

  @Post('add-device/by-me')
  @ApiOperation({
    summary: 'Add device to user cart',
    description:
      'Add a specified device to the shopping cart of the user identified by userId.',
  })
  @Auth(Role.user)
  async addDeviceToCartByMe(
    @GetUser() user: User,
    @Body() dto: AddDeviceToCartDto,
  ): Promise<Cart> {
    return this.cartService.addDeviceToCartByMe(user.id, dto);
  }

  @Patch('update-device/by-me')
  @ApiOperation({
    summary: 'Update device to user cart',
    description:
      'Update the shopping cart for the user identified by userId with the specified devices.',
  })
  @Auth(Role.user)
  async updateDeviceToCartByMe(
    @GetUser() user: User,
    @Body() dto: UpdateDeviceToCartDto,
  ): Promise<Cart> {
    return this.cartService.updateDeviceToCartByMe(user.id, dto);
  }

  @Delete('remove-device/:deviceId/by-me')
  @ApiOperation({
    summary: 'Remove device from user cart',
    description:
      'Remove a specified device from the shopping cart of the user identified by userId.',
  })
  @Auth(Role.user)
  async removeDeviceFromCartByMe(
    @GetUser() user: User,
    @Param('deviceId') deviceId: string,
  ): Promise<Cart> {
    return this.cartService.removeDeviceFromCartByMe(user.id, deviceId);
  }
}
