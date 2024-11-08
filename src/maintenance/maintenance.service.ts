import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceFilterDto } from './dto/maintenance-filter.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';

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
      throw new InternalServerErrorException(
        'Failed to retrieve maintenance records with pagination and filters',
      );
    }
  }

  async findAll(): Promise<Maintenance[]> {
    try {
      return await this.prisma.maintenance.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve maintenances');
    }
  }

  async findOne(id: string): Promise<Maintenance> {
    try {
      const maintenance = await this.prisma.maintenance.findUniqueOrThrow({
        where: { id },
      });
      return maintenance;
    } catch (error) {
      throw new NotFoundException('Maintenance not found');
    }
  }

  async create(dto: CreateMaintenanceDto): Promise<Maintenance> {
    try {
      const newMaintenance = await this.prisma.maintenance.create({
        data: dto,
      });
      return newMaintenance;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create maintenance');
    }
  }

  async update(id: string, dto: UpdateMaintenanceDto): Promise<Maintenance> {
    try {
      const updatedMaintenance = await this.prisma.maintenance.update({
        where: { id },
        data: dto,
      });
      return updatedMaintenance;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Maintenance not found');
      }
      throw new InternalServerErrorException('Failed to update maintenance');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.maintenance.delete({
        where: { id },
      });
      return { message: 'Maintenance deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Maintenance not found');
    }
  }

  async findByDeviceId(deviceId: string): Promise<Maintenance[]> {
    try {
      const maintenances = await this.prisma.maintenance.findMany({
        where: { deviceId },
      });
      if (maintenances.length === 0) {
        throw new NotFoundException(
          'No maintenance records found for this device',
        );
      }
      return maintenances;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve maintenances for the device',
      );
    }
  }
}
