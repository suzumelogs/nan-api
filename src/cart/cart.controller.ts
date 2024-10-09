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
}
