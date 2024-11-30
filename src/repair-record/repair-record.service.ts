import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, RepairRecord } from '@prisma/client';

import { prismaErrorHandler } from 'src/common/messages';
import { RepairRecordFilterDto } from './dto/repair-record-create.dto';
import { CreateRepairRecordDto } from './dto/create-repair-record.dto';
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
}
