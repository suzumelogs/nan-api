import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
        this.prisma.category.count({ where: whereClause }),
      ]);

      return { data, total, page, limit };
    } catch {
      throw new InternalServerErrorException('Lấy danh mục thất bại');
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany();
    } catch {
      throw new InternalServerErrorException('Lấy danh mục thất bại');
    }
  }

  async findOne(id: string): Promise<{ data: Category }> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
        include: { devices: true },
      });
      return { data: category };
    } catch {
      throw new NotFoundException('Danh mục không tồn tại');
    }
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.create({ data: dto });
    } catch {
      throw new InternalServerErrorException('Tạo danh mục thất bại');
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Danh mục không tồn tại');
      }
      throw new InternalServerErrorException('Cập nhật danh mục thất bại');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.category.delete({ where: { id } });
      return { message: 'Xóa danh mục thành công' };
    } catch {
      throw new NotFoundException('Danh mục không tồn tại');
    }
  }

  async getLabelValue(): Promise<LabelValueResponse[]> {
    try {
      const categories = await this.prisma.category.findMany();
      return categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
    } catch {
      throw new InternalServerErrorException('Lấy dữ liệu thất bại');
    }
  }
}
