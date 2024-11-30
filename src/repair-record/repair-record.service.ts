import { Injectable } from '@nestjs/common';
import { Prisma, RepairRecord } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { prismaErrorHandler } from 'src/common/messages';
import { CreateRepairRecordDto } from './dto/create-repair-record.dto';
import { RepairRecordFilterDto } from './dto/repair-record-create.dto';
import { UpdateRepairRecordDto } from './dto/update-repair-record.dto';

@Injectable()
export class RepairRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<RepairRecordFilterDto>,
  ): Promise<{
    data: RepairRecord[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const whereClause: Prisma.RepairRecordWhereInput = {
        ...(filters.equipmentId && { equipmentId: filters.equipmentId }),
        ...(filters.repairDate && { repairDate: { gte: filters.repairDate } }),
        ...(filters.failureCause && {
          failureCause: {
            contains: filters.failureCause,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.repairRecord.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            repairDate: 'desc',
          },
        }),
        this.prisma.repairRecord.count({
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

  async findAll(): Promise<{ data: RepairRecord[] }> {
    try {
      const repairRecords = await this.prisma.repairRecord.findMany();
      return { data: repairRecords };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: RepairRecord }> {
    try {
      const repairRecord = await this.prisma.repairRecord.findUniqueOrThrow({
        where: { id },
      });
      return { data: repairRecord };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateRepairRecordDto): Promise<{ message: string }> {
    try {
      await this.prisma.repairRecord.create({ data: dto });
      return { message: 'Tạo mới thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async update(
    id: string,
    dto: UpdateRepairRecordDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.repairRecord.update({ where: { id }, data: dto });
      return { message: 'Cập nhật thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.repairRecord.delete({ where: { id } });
      return { message: 'Xóa thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getStatistics(): Promise<{
    totalRepairs: number;
    totalCost: number;
    equipmentSummary: { equipmentId: string; repairCount: number }[];
  }> {
    try {
      const [totalRepairs, totalCost, equipmentSummary] = await Promise.all([
        this.prisma.repairRecord.count(),
        this.prisma.repairRecord.aggregate({
          _sum: { repairCost: true },
        }),
        this.prisma.repairRecord.groupBy({
          by: ['equipmentId'],
          _count: { id: true },
        }),
      ]);

      return {
        totalRepairs,
        totalCost: totalCost._sum.repairCost || 0,
        equipmentSummary: equipmentSummary.map((item) => ({
          equipmentId: item.equipmentId,
          repairCount: item._count.id,
        })),
      };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async checkWarranty(id: string): Promise<{ isUnderWarranty: boolean }> {
    try {
      const repairRecord = await this.prisma.repairRecord.findUniqueOrThrow({
        where: { id },
        select: { warranty: true },
      });

      return {
        isUnderWarranty: repairRecord.warranty
          ? new Date(repairRecord.warranty) >= new Date()
          : false,
      };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findByEquipmentId(
    equipmentId: string,
  ): Promise<{ data: RepairRecord[] }> {
    try {
      const repairRecords = await this.prisma.repairRecord.findMany({
        where: { equipmentId },
        orderBy: {
          repairDate: 'desc',
        },
      });

      return { data: repairRecords };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<{ message: string }> {
    try {
      await this.prisma.repairRecord.deleteMany({
        where: { id: { in: ids } },
      });
      return { message: 'Xóa thành công các bản ghi' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
