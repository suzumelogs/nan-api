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
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';

@ApiBearerAuth()
@ApiTags('Discounts')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả mã giảm giá (Không phân trang)',
  })
  findAll(): Promise<Discount[]> {
    return this.discountService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy mã giảm giá theo ID.',
  })
  findOne(@Param('id') id: string): Promise<Discount> {
    return this.discountService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo mã giảm giá mới',
  })
  create(@Body() createDiscountDto: CreateDiscountDto): Promise<Discount> {
    return this.discountService.create(createDiscountDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật mã giảm giá theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa mã giảm giá theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.discountService.remove(id);
  }
}
