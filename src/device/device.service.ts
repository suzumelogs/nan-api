import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Device[]> {
    try {
      return await this.prisma.device.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve devices');
    }
  }

  async findOne(id: string): Promise<Device> {
    try {
      return await this.prisma.device.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Device not found');
    }
  }

  async create(dto: CreateDeviceDto): Promise<Device> {
    try {
      return await this.prisma.device.create({
        data: dto,
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
