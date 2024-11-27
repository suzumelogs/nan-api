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
import { Category, Equipment } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { CategoryService } from './category.service';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả danh mục (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: CategoryFilterDto,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.categoryService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Tất cả danh mục (Không phân trang)',
  })
  findAll(): Promise<{ data: Category[] }> {
    return this.categoryService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Danh mục theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Category }> {
    return this.categoryService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo danh mục mới',
  })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string }> {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật danh mục theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string }> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa danh mục theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.remove(id);
  }

  @Get('all/label-value')
  @ApiOperation({
    summary: 'Tất cả danh mục (Định dạng label value)',
  })
  getLabelValue(): Promise<LabelValueResponse[]> {
    return this.categoryService.getLabelValue();
  }

  @Get(':id/equipments/all/pagination')
  @ApiOperation({
    summary: 'Lấy danh sách thiết bị của danh mục (Có phân trang)',
  })
  async getEquipments(
    @Param('id') id: string,
    @Query() dto: PaginationDto,
  ): Promise<{ data: Equipment[]; total: number }> {
    return this.categoryService.getEquipmentsWithPagination(id, dto);
  }
}
