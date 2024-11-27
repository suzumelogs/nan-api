import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Equipment, Prisma } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { prismaErrorHandler } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { EquipmentFilterDto } from './dto/equipment-filter.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  private handlePrismaError(error: any): never {
    if (error.code === 'P2025') {
      throw new NotFoundException('Không tìm thấy');
    }
    throw new InternalServerErrorException(error.message || 'Lỗi máy chủ');
  }

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<EquipmentFilterDto>,
  ): Promise<{
    data: Equipment[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const whereClause: Prisma.EquipmentWhereInput = {
        ...(filters.name && {
          name: { contains: filters.name, mode: Prisma.QueryMode.insensitive },
        }),
        ...(filters.description && {
          description: {
            contains: filters.description,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(filters.pricePerDay && {
          pricePerDay: { gte: filters.pricePerDay },
        }),
        ...(filters.pricePerWeek && {
          pricePerWeek: { gte: filters.pricePerWeek },
        }),
        ...(filters.pricePerMonth && {
          pricePerMonth: { gte: filters.pricePerMonth },
        }),
        ...(filters.stock && {
          stock: { gte: filters.stock },
        }),
        ...(filters.categoryId && {
          categoryId: filters.categoryId,
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.equipment.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.equipment.count({
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

  async findAll(): Promise<{ data: Equipment[] }> {
    try {
      const equipments = await this.prisma.equipment.findMany({
        include: { category: true },
      });
      return { data: equipments };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: Equipment }> {
    try {
      const equipment = await this.prisma.equipment.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
        },
      });
      return { data: equipment };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateEquipmentDto): Promise<{ message: string }> {
    try {
      await this.prisma.equipment.create({
        data: dto,
      });
      return { message: 'Tạo mới thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async update(
    id: string,
    dto: UpdateEquipmentDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.equipment.update({
        where: { id },
        data: dto,
      });
      return { message: 'Cập nhật thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.equipment.delete({ where: { id } });
      return { message: 'Xóa thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getLabelValue(): Promise<{ data: LabelValueResponse[] }> {
    try {
      const equipments = await this.prisma.equipment.findMany();
      const equipmentsLabelValue = equipments.map((equipment) => ({
        label: equipment.name,
        value: equipment.id,
      }));
      return { data: equipmentsLabelValue };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
