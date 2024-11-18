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
        'Lỗi khi lấy danh sách phân trang',
      );
    }
  }

  async findAll(): Promise<{ data: Category[] }> {
    try {
      const categories = await this.prisma.category.findMany();
      return { data: categories };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi lấy danh sách danh mục');
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
      throw new NotFoundException('Không tìm thấy danh mục');
    }
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.create({ data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi tạo danh mục mới');
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.update({ where: { id }, data: dto });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Không tìm thấy danh mục');
      }
      throw new InternalServerErrorException('Lỗi khi cập nhật danh mục');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.category.delete({ where: { id } });
      return { message: 'Xóa danh mục thành công' };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
  }

  async getLabelValue(): Promise<{ data: LabelValueResponse[] }> {
    try {
      const categories = await this.prisma.category.findMany();
      const categoriesLabelValue = categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      return { data: categoriesLabelValue };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi lấy label-value');
    }
  }
}
