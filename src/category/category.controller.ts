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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieve a list of all categories available.',
  })
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieve category details by its ID.',
  })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Create a new category with the provided details.',
  })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category by ID',
    description: 'Update the details of an existing category by its ID.',
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
    description: 'Delete a category by its ID.',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoryService.remove(id);
  }
}
