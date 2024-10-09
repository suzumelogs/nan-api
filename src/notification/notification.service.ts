import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Notification[]> {
    try {
      return await this.prisma.notification.findMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve notifications',
      );
    }
  }

  async findOne(id: string): Promise<Notification> {
    try {
      const notification = await this.prisma.notification.findUniqueOrThrow({
        where: { id },
      });
      return notification;
    } catch (error) {
      throw new NotFoundException('Notification not found');
    }
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    try {
      const newNotification = await this.prisma.notification.create({
        data: dto,
      });
      return newNotification;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    try {
      const updatedNotification = await this.prisma.notification.update({
        where: { id },
        data: dto,
      });
      return updatedNotification;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Notification not found');
      }
      throw new InternalServerErrorException('Failed to update notification');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.notification.delete({
        where: { id },
      });
      return { message: 'Notification deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Notification not found');
    }
  }
}
