import { Injectable } from '@nestjs/common';
import { Equipment, EquipmentPackage, Prisma } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaErrorHandler } from '../common/messages/prisma-error-hanler.message';
import { CreateEquipmentPackageDto } from './dto/create-equipment-package.dto';
import { EquipmentPackageFilterDto } from './dto/equipment-package-filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateEquipmentPackageDto } from './dto/update-equipment-package.dto';
import { AddEquipmentsToPackageDto } from './dto/add-equipments-to-package.dto';

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
        ...(filters.basePrice && {
          basePrice: { gte: filters.basePrice },
        }),
        ...(filters.rentalPrice && {
          rentalPrice: { gte: filters.rentalPrice },
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.equipmentPackage.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
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
      prismaErrorHandler(error);
    }
  }

  async findAll(): Promise<{ data: EquipmentPackage[] }> {
    try {
      const equipmentPackages = await this.prisma.equipmentPackage.findMany({
        include: {
          equipments: {
            include: {
              equipment: {
                include: {
                  maintenances: {
                    where: {
                      status: { not: 'pending' },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return { data: equipmentPackages };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: EquipmentPackage }> {
    try {
      const equipmentPackage =
        await this.prisma.equipmentPackage.findUniqueOrThrow({
          where: { id },
          include: {
            equipments: {
              include: {
                equipment: true,
              },
            },
          },
        });
      return { data: equipmentPackage };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateEquipmentPackageDto): Promise<{ message: string }> {
    try {
      await this.prisma.equipmentPackage.create({
        data: {
          name: dto.name,
          description: dto.description,
          basePrice: dto.basePrice,
          rentalPrice: dto.rentalPrice,
          image: dto.image,
          equipments: {
            create: dto.equipmentIds?.map((equipmentId) => ({
              equipmentId,
            })),
          },
        },
      });

      return {
        message: 'Tạo gói thiết bị và thêm thiết bị vào gói thành công',
      };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async update(
    id: string,
    dto: UpdateEquipmentPackageDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.equipmentPackage.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          basePrice: dto.basePrice,
          rentalPrice: dto.rentalPrice,
          image: dto.image,
        },
      });

      if (dto.equipmentIds) {
        await this.prisma.equipmentPackageOnEquipment.deleteMany({
          where: { packageId: id },
        });

        const data = dto.equipmentIds.map((equipmentId) => ({
          packageId: id,
          equipmentId: equipmentId,
        }));

        await this.prisma.equipmentPackageOnEquipment.createMany({
          data,
        });
      }

      return { message: 'Cập nhật thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.equipmentPackage.delete({ where: { id } });
      return { message: 'Xóa thành công' };
    } catch (error) {
      prismaErrorHandler(error);
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
      prismaErrorHandler(error);
    }
  }

  async getEquipmentsWithPagination(
    id: string,
    dto: PaginationDto,
  ): Promise<{
    data: Equipment[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const skip = (dto.page - 1) * dto.limit;

      const equipmentPackageOnEquipments =
        await this.prisma.equipmentPackageOnEquipment.findMany({
          where: {
            packageId: id,
          },
          take: dto.limit,
          skip: skip,
          include: {
            equipment: true,
          },
        });

      const total = await this.prisma.equipmentPackageOnEquipment.count({
        where: {
          packageId: id,
        },
      });

      return {
        data: equipmentPackageOnEquipments.map((e) => e.equipment),
        total,
        page: dto.page,
        limit: dto.limit,
      };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async addEquipmentsToPackage(
    dto: AddEquipmentsToPackageDto,
  ): Promise<{ message: string }> {
    try {
      const existingEquipments =
        await this.prisma.equipmentPackageOnEquipment.findMany({
          where: { packageId: dto.packageId },
          select: { equipmentId: true },
        });

      const existingEquipmentIds = existingEquipments.map(
        (item) => item.equipmentId,
      );

      const newEquipmentIds = dto.equipmentIds.filter(
        (id) => !existingEquipmentIds.includes(id),
      );

      if (newEquipmentIds.length === 0) {
        return { message: 'Tất cả thiết bị đã có trong gói' };
      }

      const data = newEquipmentIds.map((equipmentId) => ({
        packageId: dto.packageId,
        equipmentId,
      }));

      await this.prisma.equipmentPackageOnEquipment.createMany({
        data,
      });

      return { message: 'Thêm thiết bị vào gói thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
