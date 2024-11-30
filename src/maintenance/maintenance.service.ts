import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Maintenance, MaintenanceStatus, Prisma } from '@prisma/client';
import { prismaErrorHandler } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceFilterDto } from './dto/maintenance-filter.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<MaintenanceFilterDto>,
  ): Promise<{
    data: Maintenance[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const whereClause: Prisma.MaintenanceWhereInput = {
        ...(filters.maintenanceDate && {
          maintenanceDate: new Date(filters.maintenanceDate),
        }),
        ...(filters.description && {
          description: { contains: filters.description, mode: 'insensitive' },
        }),
        ...(filters.suggestedNextMaintenance && {
          suggestedNextMaintenance: new Date(filters.suggestedNextMaintenance),
        }),
        ...(filters.status && { status: filters.status }),
        ...(filters.maintenanceCost && {
          maintenanceCost: filters.maintenanceCost,
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.maintenance.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.maintenance.count({
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

  async findAll(): Promise<{ data: Maintenance[] }> {
    try {
      const maintenances = await this.prisma.maintenance.findMany();
      return { data: maintenances };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: Maintenance }> {
    try {
      const maintenance = await this.prisma.maintenance.findUniqueOrThrow({
        where: { id },
      });
      return { data: maintenance };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateMaintenanceDto): Promise<{ message: string }> {
    try {
      await this.prisma.maintenance.create({
        data: dto,
      });

      return { message: 'Tạo mới thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async update(
    id: string,
    dto: UpdateMaintenanceDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.maintenance.update({
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
      await this.prisma.maintenance.delete({
        where: { id },
      });

      return { message: 'Xóa thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async updateStatus(updateDto: UpdateStatusDto): Promise<{ message: string }> {
    try {
      const { id, status, maintenanceCost } = updateDto;

      await this.prisma.maintenance.update({
        where: { id },
        data: {
          status,
          ...(maintenanceCost && { maintenanceCost }),
        },
      });

      return { message: 'Trạng thái bảo trì đã được cập nhật thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findByStatus(
    status: MaintenanceStatus,
  ): Promise<{ data: Maintenance[] }> {
    try {
      const maintenances = await this.prisma.maintenance.findMany({
        where: { status },
      });
      return { data: maintenances };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findNextMaintenance(): Promise<{ data: Maintenance }> {
    try {
      const nextMaintenance = await this.prisma.maintenance.findFirst({
        where: {
          suggestedNextMaintenance: {
            gte: new Date(),
          },
        },
        orderBy: {
          suggestedNextMaintenance: 'asc',
        },
      });
      return { data: nextMaintenance };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async calculateTotalCost(
    filters: Partial<MaintenanceFilterDto>,
  ): Promise<{ totalCost: number }> {
    try {
      const whereClause: Prisma.MaintenanceWhereInput = {
        ...(filters.maintenanceDate && {
          maintenanceDate: { gte: new Date(filters.maintenanceDate) },
        }),
        ...(filters.suggestedNextMaintenance && {
          suggestedNextMaintenance: {
            lte: new Date(filters.suggestedNextMaintenance),
          },
        }),
        ...(filters.status && { status: filters.status }),
      };

      const totalCost = await this.prisma.maintenance.aggregate({
        _sum: {
          maintenanceCost: true,
        },
        where: whereClause,
      });

      return { totalCost: totalCost._sum.maintenanceCost || 0 };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getMaintenanceHistory(
    equipmentId: string,
  ): Promise<{ data: Maintenance[] }> {
    try {
      const maintenances = await this.prisma.maintenance.findMany({
        where: {
          equipmentId: equipmentId,
        },
        orderBy: {
          maintenanceDate: 'desc',
        },
      });
      return { data: maintenances };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getMaintenanceSummaryByEquipment(equipmentId: string): Promise<{
    data: {
      totalCost: number;
      maintenanceCount: number;
      lastMaintenanceDate: Date | null;
    };
  }> {
    try {
      const summary = await this.prisma.maintenance.aggregate({
        _sum: {
          maintenanceCost: true,
        },
        _count: {
          id: true,
        },
        where: {
          equipmentId: equipmentId,
        },
      });

      return {
        data: {
          totalCost: summary._sum.maintenanceCost || 0,
          maintenanceCount: summary._count.id || 0,
          lastMaintenanceDate:
            summary._count.id > 0
              ? await this.prisma.maintenance
                  .findFirst({
                    where: { equipmentId },
                    orderBy: { maintenanceDate: 'desc' },
                    select: { maintenanceDate: true },
                  })
                  .then((res) => res?.maintenanceDate)
              : null,
        },
      };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async bulkCreate(dto: CreateMaintenanceDto[]): Promise<{ message: string }> {
    try {
      await this.prisma.maintenance.createMany({
        data: dto,
      });

      return { message: 'Tạo mới bảo trì thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getMaintenanceByEquipmentAndDateRange(
    equipmentId: string,
    startDate: string,
    endDate: string,
  ): Promise<{ data: Maintenance[] }> {
    try {
      const maintenances = await this.prisma.maintenance.findMany({
        where: {
          equipmentId: equipmentId,
          maintenanceDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: {
          maintenanceDate: 'asc',
        },
      });

      return { data: maintenances };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
