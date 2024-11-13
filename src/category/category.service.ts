import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<CategoryFilterDto>,
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    try {
      const whereClause: Prisma.CategoryWhereInput = {
        ...(filters.name && {
          name: { contains: filters.name, mode: Prisma.QueryMode.insensitive },
        }),
        ...(filters.description && {
          description: {
            contains: filters.description,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.category.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.category.count({
          where: whereClause,
        }),
      ]);

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve categories with pagination and filters',
      );
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve categories');
    }
  }

  async findOne(id: string): Promise<{ data: Category }> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
        include: {
          devices: true,
        },
      });
      return { data: category };
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = await this.prisma.category.create({
        data: dto,
      });
      return newCategory;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: dto,
      });
      return updatedCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }

  async getLabelValue(): Promise<{ data: LabelValueResponse[] }> {
    try {
      const categories = await this.prisma.category.findMany();
      return {
        data:
          categories.length > 0
            ? categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))
            : [],
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve label-value pairs',
      );
    }
  }
}
