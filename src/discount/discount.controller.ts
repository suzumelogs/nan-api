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
import { Discount } from '@prisma/client';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { DiscountFilterDto } from './dto/discount-filter.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@ApiBearerAuth()
@ApiTags('Discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả mã giảm giá (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: DiscountFilterDto,
  ): Promise<{ data: Discount[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.discountService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Lấy tất cả mã giảm giá (Không phân trang)',
  })
  findAll(): Promise<{ data: Discount[] }> {
    return this.discountService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Mã giảm giá theo ID.',
  })
  findOne(@Param('id') id: string): Promise<{ data: Discount }> {
    return this.discountService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo mã giảm giá mới',
  })
  create(@Body() createDiscountDto: CreateDiscountDto): Promise<Discount> {
    return this.discountService.create(createDiscountDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật mã giảm giá theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa mã giảm giá theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.discountService.remove(id);
  }
}
