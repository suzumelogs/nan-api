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
import { LabelValueResponse } from 'src/common';
import { CategoryService } from './category.service';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Lất tất cả gói (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: CategoryFilterDto,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.categoryService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Lấy tất cả gói (Không phân trang)',
  })
  findAll(): Promise<{ data: Category[] }> {
    return this.categoryService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Lấy gói theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Category }> {
    return this.categoryService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo gói mới',
  })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật gói theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa gói theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.remove(id);
  }

  @Get('all/label-value')
  @ApiOperation({
    summary: 'Lấy tất cả gói (Định dạng label value)',
  })
  getLabelValue(): Promise<{ data: LabelValueResponse[] }> {
    return this.categoryService.getLabelValue();
  }
}
