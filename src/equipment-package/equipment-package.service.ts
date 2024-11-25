import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EquipmentPackage, Prisma } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEquipmentPackageDto } from './dto/create-equipment-package.dto';
import { EquipmentPackageFilterDto } from './dto/equipment-package-filter.dto';
import { UpdateEquipmentPackageDto } from './dto/update-equipment-package.dto';

@Injectable()
export class EquipmentPackageService {
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
    filters: Partial<EquipmentPackageFilterDto>,
  ): Promise<{
    data: EquipmentPackage[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const whereClause: Prisma.EquipmentPackageWhereInput = {
        ...(filters.name && {
          name: {
            contains: filters.name,
            mode: Prisma.QueryMode.insensitive,
          },
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
      };

      const [data, total] = await Promise.all([
        this.prisma.equipmentPackage.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.equipmentPackage.count({
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
      this.handlePrismaError(error);
    }
  }

  async findAll(): Promise<{ data: EquipmentPackage[] }> {
    try {
      const equipmentPackages = await this.prisma.equipmentPackage.findMany();
      return { data: equipmentPackages };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findOne(id: string): Promise<{ data: EquipmentPackage }> {
    try {
      const equipmentPackage =
        await this.prisma.equipmentPackage.findUniqueOrThrow({
          where: { id },
        });
      return { data: equipmentPackage };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async create(dto: CreateEquipmentPackageDto): Promise<{ message: string }> {
    try {
      await this.prisma.equipmentPackage.create({
        data: dto,
      });

      return { message: 'Tạo mới thành công' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(
    id: string,
    dto: UpdateEquipmentPackageDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.equipmentPackage.update({
        where: { id },
        data: dto,
      });

      return { message: 'Cập nhật thành công' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.equipmentPackage.delete({ where: { id } });
      return { message: 'Xóa thành công' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getLabelValue(): Promise<{ data: LabelValueResponse[] }> {
    try {
      const equipmentPackages = await this.prisma.equipmentPackage.findMany();
      const equipmentPackagesLabelValue = equipmentPackages.map(
        (equipmentPackage) => ({
          label: equipmentPackage.name,
          value: equipmentPackage.id,
        }),
      );
      return { data: equipmentPackagesLabelValue };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
