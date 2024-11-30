import { Injectable } from '@nestjs/common';
import { Prisma, UsageRecord } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { prismaErrorHandler } from 'src/common/messages';
import { CreateUsageRecordDto } from './dto/create-usage-record.dto';
import { UpdateUsageRecordDto } from './dto/update-usage-record.dto';
import { UsageRecordFilterDto } from './dto/usage-record-filter.dto';

@Injectable()
export class UsageRecordService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<UsageRecordFilterDto>,
  ): Promise<{
    data: UsageRecord[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const whereClause: Prisma.UsageRecordWhereInput = {
        ...(filters.equipmentId && { equipmentId: filters.equipmentId }),
        ...(filters.rentalDate && { rentalDate: { gte: filters.rentalDate } }),
        ...(filters.returnDate && { returnDate: { lte: filters.returnDate } }),
        ...(filters.usageDuration && { usageDuration: filters.usageDuration }),
        ...(filters.incidents && {
          incidents: {
            contains: filters.incidents,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.usageRecord.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            rentalDate: 'desc',
          },
        }),
        this.prisma.usageRecord.count({
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

  async findAll(): Promise<{ data: UsageRecord[] }> {
    try {
      const usageRecords = await this.prisma.usageRecord.findMany();
      return { data: usageRecords };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: UsageRecord }> {
    try {
      const usageRecord = await this.prisma.usageRecord.findUniqueOrThrow({
        where: { id },
      });
      return { data: usageRecord };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateUsageRecordDto): Promise<{ message: string }> {
    try {
      await this.prisma.usageRecord.create({ data: dto });
      return { message: 'Tạo mới thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async update(
    id: string,
    dto: UpdateUsageRecordDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.usageRecord.update({ where: { id }, data: dto });
      return { message: 'Cập nhật thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.usageRecord.delete({ where: { id } });
      return { message: 'Xóa thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getStatistics(): Promise<{
    totalUsage: number;
    totalDuration: number;
    totalIncidents: number;
  }> {
    try {
      const [totalUsage, totalDuration, totalIncidents] = await Promise.all([
        this.prisma.usageRecord.count(),
        this.prisma.usageRecord.aggregate({
          _sum: { usageDuration: true },
        }),
        this.prisma.usageRecord.count({
          where: { incidents: { not: null } },
        }),
      ]);

      return {
        totalUsage,
        totalDuration: totalDuration._sum.usageDuration || 0,
        totalIncidents,
      };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findUnreturnedRecords(): Promise<{ data: UsageRecord[] }> {
    try {
      const unreturnedRecords = await this.prisma.usageRecord.findMany({
        where: { returnDate: null },
        orderBy: { rentalDate: 'desc' },
      });
      return { data: unreturnedRecords };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<{ message: string }> {
    try {
      await this.prisma.usageRecord.deleteMany({
        where: { id: { in: ids } },
      });
      return { message: 'Xóa thành công các bản ghi' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findByEquipmentId(
    equipmentId: string,
  ): Promise<{ data: UsageRecord[] }> {
    try {
      const usageRecords = await this.prisma.usageRecord.findMany({
        where: { equipmentId },
        orderBy: { rentalDate: 'desc' },
      });
      return { data: usageRecords };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async markAsReturned(
    id: string,
    returnDate: Date,
  ): Promise<{ message: string }> {
    try {
      const usageRecord = await this.prisma.usageRecord.findUniqueOrThrow({
        where: { id },
      });

      const usageDuration = Math.ceil(
        (returnDate.getTime() - new Date(usageRecord.rentalDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      await this.prisma.usageRecord.update({
        where: { id },
        data: { returnDate, usageDuration },
      });

      return { message: 'Đã cập nhật trạng thái trả thiết bị' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
