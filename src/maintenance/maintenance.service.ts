import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

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
}
