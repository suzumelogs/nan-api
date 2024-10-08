import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from '@prisma/client';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Device[]> {
    try {
      return await this.prisma.device.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          description: true,
          dailyPrice: true,
          weeklyPrice: true,
          monthlyPrice: true,
          depositRate: true,
          value: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve devices');
    }
  }

  async findOne(id: string): Promise<Device> {
    try {
      return await this.prisma.device.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          image: true,
          description: true,
          dailyPrice: true,
          weeklyPrice: true,
          monthlyPrice: true,
          depositRate: true,
          value: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Device not found');
    }
  }

  async create(dto: CreateDeviceDto): Promise<Device> {
    try {
      return await this.prisma.device.create({
        data: dto,
        select: {
          id: true,
          name: true,
          image: true,
          description: true,
          dailyPrice: true,
          weeklyPrice: true,
          monthlyPrice: true,
          depositRate: true,
          value: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create device');
    }
  }

  async update(id: string, dto: UpdateDeviceDto): Promise<Device> {
    try {
      return await this.prisma.device.update({
        where: { id },
        data: dto,
        select: {
          id: true,
          name: true,
          image: true,
          description: true,
          dailyPrice: true,
          weeklyPrice: true,
          monthlyPrice: true,
          depositRate: true,
          value: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Device not found');
      }
      throw new InternalServerErrorException('Failed to update device');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.device.delete({
        where: { id },
      });
      return { message: 'Device deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Device not found');
    }
  }
}
