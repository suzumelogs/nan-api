import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Notification[]> {
    try {
      return await this.prisma.notification.findMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Lấy danh sách thông báo thất bại',
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
      throw new NotFoundException('Không tìm thấy thông báo');
    }
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    try {
      const newNotification = await this.prisma.notification.create({
        data: dto,
      });
      return newNotification;
    } catch (error) {
      throw new InternalServerErrorException('Tạo thông báo thất bại');
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
        throw new NotFoundException('Không tìm thấy thông báo');
      }
      throw new InternalServerErrorException('Cập nhật thông báo thất bại');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.notification.delete({
        where: { id },
      });
      return { message: 'Xóa thông báo thành công' };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }
  }

  async findAllByUserId(userId: string): Promise<Notification[]> {
    try {
      return await this.prisma.notification.findMany({
        where: { userId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lấy danh sách thông báo cho người dùng thất bại',
      );
    }
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    try {
      return await this.prisma.notification.findMany({
        where: { userId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Lấy danh sách thông báo cho người dùng thất bại',
      );
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      return await this.prisma.notification.update({
        where: { id },
        data: {
          status: NotificationStatus.read,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Không tìm thấy thông báo');
      }
      throw new InternalServerErrorException(
        'Đánh dấu thông báo là đã đọc thất bại',
      );
    }
  }

  async sendNotification({
    message,
    userId,
  }: {
    message: string;
    userId: string;
  }): Promise<Notification> {
    const notificationDto: CreateNotificationDto = {
      message,
      userId,
      status: NotificationStatus.unread,
    };

    return await this.create(notificationDto);
  }
}
