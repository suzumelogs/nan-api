import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Category, Equipment, Prisma } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { prismaErrorHandler } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from './dto/pagination.dto';

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
          orderBy: {
            createdAt: 'desc',
          },
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
      prismaErrorHandler(error);
    }
  }

  async findAll(): Promise<{ data: Category[] }> {
    try {
      const categories = await this.prisma.category.findMany();
      return { data: categories };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: Category }> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
        include: {
          equipments: true,
        },
      });
      return { data: category };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateCategoryDto): Promise<{ message: string }> {
    try {
      await this.prisma.category.create({ data: dto });
      return { message: 'Tạo mới thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.category.update({ where: { id }, data: dto });
      return { message: 'Cập nhật thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.category.delete({ where: { id } });
      return { message: 'Xóa thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getLabelValue(): Promise<LabelValueResponse[]> {
    try {
      const categories = await this.prisma.category.findMany();
      const categoriesLabelValue = categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      return categoriesLabelValue;
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getEquipmentsWithPagination(
    id: string,
    dto: PaginationDto,
  ): Promise<{
    data: Equipment[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục này');
      }

      const { page, limit } = dto;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.equipment.findMany({
          where: { categoryId: id },
          skip,
          take: limit,
        }),
        this.prisma.equipment.count({
          where: { categoryId: id },
        }),
      ]);

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
