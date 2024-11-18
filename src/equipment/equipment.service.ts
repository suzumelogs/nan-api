import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Equipment, Prisma } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
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
    data: Equipment[];
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
        ...(filters.pricePerDay && {
          pricePerDay: { gte: filters.pricePerDay },
        }),
        ...(filters.pricePerWeek && {
          pricePerWeek: { gte: filters.pricePerWeek },
        }),
        ...(filters.pricePerMonth && {
          pricePerMonth: { gte: filters.pricePerMonth },
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
        }),
        this.prisma.equipment.count({
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
      throw new InternalServerErrorException('Lỗi khi lấy danh sách thiết bị');
    }
  }

  async findAll(): Promise<{ data: Equipment[] }> {
    try {
      const equipments = await this.prisma.equipment.findMany();
      return { data: equipments };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi lấy danh sách thiết bị');
    }
  }

  async findOne(id: string): Promise<{ data: Equipment }> {
    try {
      const equipment = await this.prisma.equipment.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
        },
      });
      return { data: equipment };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy thiết bị');
    }
  }

  async create(dto: CreateEquipmentDto): Promise<Equipment> {
    try {
      return await this.prisma.equipment.create({
        data: {
          name: dto.name,
          image: dto.image,
          description: dto.description,
          pricePerDay: dto.pricePerDay,
          pricePerWeek: dto.pricePerWeek,
          pricePerMonth: dto.pricePerMonth,
          stock: dto.stock,
          category: {
            connect: { id: dto.categoryId },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi tạo thiết bị mới');
    }
  }

  async update(id: string, dto: UpdateEquipmentDto): Promise<Equipment> {
    try {
      return await this.prisma.equipment.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }
      throw new InternalServerErrorException('Lỗi khi cập nhật thiết bị');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.equipment.delete({ where: { id } });
      return { message: 'Xóa thiết bị thành công' };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy thiết bị');
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
      throw new InternalServerErrorException('Lỗi khi lấy label-value');
    }
  }
}
