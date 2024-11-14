import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Device, DeviceStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceFilterDto } from './dto/device-filter.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<DeviceFilterDto>,
  ): Promise<{ data: Device[]; total: number; page: number; limit: number }> {
    try {
      const whereClause: Prisma.DeviceWhereInput = {
        ...(filters.name && {
          name: { contains: filters.name, mode: Prisma.QueryMode.insensitive },
        }),
        ...(filters.description && {
          description: {
            contains: filters.description,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
        ...(filters.priceDay && { priceDay: filters.priceDay }),
        ...(filters.priceWeek && { priceWeek: filters.priceWeek }),
        ...(filters.priceMonth && { priceMonth: filters.priceMonth }),
        ...(filters.status && { status: filters.status as DeviceStatus }),
      };

      const [data, total] = await Promise.all([
        this.prisma.device.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.device.count({
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
      throw new InternalServerErrorException('Lấy thiết bị thất bại');
    }
  }

  async findAll(): Promise<Device[]> {
    try {
      return await this.prisma.device.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Lấy thiết bị thất bại');
    }
  }

  async findOne(id: string): Promise<Device> {
    try {
      return await this.prisma.device.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Thiết bị không tồn tại');
    }
  }

  async create(dto: CreateDeviceDto): Promise<Device> {
    try {
      return await this.prisma.device.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Tạo thiết bị thất bại');
    }
  }

  async update(id: string, dto: UpdateDeviceDto): Promise<Device> {
    try {
      return await this.prisma.device.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Thiết bị không tồn tại');
      }
      throw new InternalServerErrorException('Cập nhật thất bại');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.device.delete({
        where: { id },
      });
      return { message: 'Xóa thành công' };
    } catch (error) {
      throw new NotFoundException('Thiết bị không tồn tại');
    }
  }
}
