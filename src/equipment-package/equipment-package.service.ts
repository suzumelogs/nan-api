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
      throw new InternalServerErrorException(
        'Lỗi khi lấy danh sách gói thiết bị',
      );
    }
  }

  async findAll(): Promise<{ data: EquipmentPackage[] }> {
    try {
      const equipmentPackages = await this.prisma.equipmentPackage.findMany();
      return { data: equipmentPackages };
    } catch (error) {
      throw new InternalServerErrorException(
        'Lỗi khi lấy danh sách gói thiết bị',
      );
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
      throw new NotFoundException('Không tìm thấy gói thiết bị');
    }
  }

  async create(dto: CreateEquipmentPackageDto): Promise<EquipmentPackage> {
    try {
      return await this.prisma.equipmentPackage.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi tạo gói thiết bị mới');
    }
  }

  async update(
    id: string,
    dto: UpdateEquipmentPackageDto,
  ): Promise<EquipmentPackage> {
    try {
      return await this.prisma.equipmentPackage.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Không tìm thấy gói thiết bị');
      }
      throw new InternalServerErrorException('Lỗi khi cập nhật gói thiết bị');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.equipmentPackage.delete({ where: { id } });
      return { message: 'Xóa gói thiết bị thành công' };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy gói thiết bị');
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
      throw new InternalServerErrorException('Lỗi khi lấy label-value');
    }
  }
}
