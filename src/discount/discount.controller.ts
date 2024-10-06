import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';

@ApiBearerAuth()
@ApiTags('Discount')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all discounts',
    description: 'Retrieve a list of all discounts available.',
  })
  findAll(): Promise<Discount[]> {
    return this.discountService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get discount by ID',
    description: 'Retrieve discount details by its ID.',
  })
  findOne(@Param('id') id: string): Promise<Discount> {
    return this.discountService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new discount',
    description: 'Create a new discount with the provided details.',
  })
  create(@Body() createDiscountDto: CreateDiscountDto): Promise<Discount> {
    return this.discountService.create(createDiscountDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update discount by ID',
    description: 'Update the details of an existing discount by its ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete discount by ID',
    description: 'Delete a discount by its ID.',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.discountService.remove(id);
  }
}
