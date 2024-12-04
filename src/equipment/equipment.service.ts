import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Equipment, EquipmentPackage, Prisma } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { prismaErrorHandler } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { EquipmentFilterDto } from './dto/equipment-filter.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<EquipmentFilterDto>,
  ): Promise<{
    data: (Equipment & { maintainCount: number })[];
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
        ...(filters.basePrice && {
          basePrice: { gte: filters.basePrice },
        }),
        ...(filters.rentalPrice && {
          rentalPrice: { gte: filters.rentalPrice },
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
          include: {
            category: true,
            maintenances: {
              where: {
                status: 'completed',
              },
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.equipment.count({
          where: whereClause,
        }),
      ]);

      const dataWithmaintainCount = data.map((equipment) => ({
        ...equipment,
        maintainCount: equipment.maintenances.length,
      }));

      return {
        data: dataWithmaintainCount,
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
        include: {
          category: true,
          maintenances: {
            where: {
              status: { not: 'pending' },
            },
          },
        },
      });

      return { data: equipments };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(
    id: string,
  ): Promise<{ data: Equipment & { maintainCount: number } }> {
    try {
      const equipment = await this.prisma.equipment.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          maintenances: {
            where: {
              status: 'completed',
            },
            select: {
              id: true,
            },
          },
        },
      });

      const maintainCount = equipment.maintenances.length;

      return {
        data: {
          ...equipment,
          maintainCount,
        },
      };
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

  async searchEquipmentOrPackage(keyword: string): Promise<{
    data: (
      | (Equipment & { type: 'equipment' })
      | (EquipmentPackage & { type: 'package' })
    )[];
  }> {
    try {
      const equipments = await this.prisma.equipment.findMany({
        where: {
          name: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      });

      const equipmentPackages = await this.prisma.equipmentPackage.findMany({
        where: {
          name: {
            contains: keyword,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      });

      return {
        data: [
          ...equipments.map((e) => ({ ...e, type: 'equipment' as const })),
          ...equipmentPackages.map((e) => ({ ...e, type: 'package' as const })),
        ],
      };
    } catch (error) {
      prismaErrorHandler(error);
      throw new Error('Error while searching equipment or packages.'); // Ensure meaningful error propagation
    }
  }
}
