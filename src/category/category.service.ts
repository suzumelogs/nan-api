import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { LabelValueResponse } from 'src/common';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve categories');
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
        include: {
          devices: true,
        },
      });
      return category;
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

  async getLabelValue(): Promise<LabelValueResponse[]> {
    try {
      const categories = await this.prisma.category.findMany();
      return categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve label-value pairs',
      );
    }
  }
}
