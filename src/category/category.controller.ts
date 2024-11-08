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

  @Get('pagination')
  @ApiOperation({
    summary: 'Get pagination categories',
  })
  async findAllPagination(
    @Query() filterDto: CategoryFilterDto,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.categoryService.findAllPagination(page, limit, filters);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
  })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
  })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category by ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete category by ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.remove(id);
  }

  @Get('label-value')
  @ApiOperation({
    summary: 'Get label-value pairs of categories',
  })
  getLabelValue(): Promise<LabelValueResponse[]> {
    return this.categoryService.getLabelValue();
  }
}
