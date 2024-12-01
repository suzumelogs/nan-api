import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Notification, NotificationStatus, Role, User } from '@prisma/client';
import { prismaErrorHandler } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: {
    status?: NotificationStatus;
  }): Promise<{ data: Notification[] }> {
    try {
      const filterConditions: any = {};

      if (params?.status) {
        filterConditions.status = params.status;
      }

      const notifications = await this.prisma.notification.findMany({
        where: filterConditions,
      });

      return { data: notifications };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: Notification }> {
    try {
      const notification = await this.prisma.notification.findUniqueOrThrow({
        where: { id },
      });
      return { data: notification };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    try {
      const newNotification = await this.prisma.notification.create({
        data: dto,
      });
      return newNotification;
    } catch (error) {
      prismaErrorHandler(error);
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
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.notification.delete({
        where: { id },
      });
      return { message: 'Xóa thông báo thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findAllByUserId(
    userId: string,
    status?: NotificationStatus,
  ): Promise<{ data: Notification[] }> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId,
          status,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return { data: notifications };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async createByUserId(
    userId: string,
    dto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      const notificationData: CreateNotificationDto = {
        ...dto,
        userId,
      };
      return await this.create(notificationData);
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async updateByUserId(
    userId: string,
    notificationId: string,
    dto: UpdateNotificationDto,
  ): Promise<Notification> {
    try {
      const notification = await this.prisma.notification.findUniqueOrThrow({
        where: { id: notificationId },
      });

      if (notification.userId !== userId) {
        throw new NotFoundException(
          'Không tìm thấy thông báo cho người dùng này',
        );
      }

      return await this.update(notificationId, dto);
    } catch (error) {
      prismaErrorHandler(error);
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
      prismaErrorHandler(error);
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

  async markAllAsReadByUserId(userId: string): Promise<{ count: number }> {
    try {
      const { count } = await this.prisma.notification.updateMany({
        where: { userId, status: NotificationStatus.unread },
        data: { status: NotificationStatus.read },
      });

      return { count };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findUnreadByUserId(userId: string): Promise<{ data: Notification[] }> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: { userId, status: NotificationStatus.unread },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return { data: notifications };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async sendBulkNotification({
    message,
    userIds,
  }: {
    message: string;
    userIds: string[];
  }): Promise<Notification[]> {
    try {
      const notifications = await Promise.all(
        userIds.map(async (userId) => {
          const notificationDto: CreateNotificationDto = {
            message,
            userId,
            status: NotificationStatus.unread,
          };
          return await this.create(notificationDto);
        }),
      );
      return notifications;
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async countNotificationsByUserId(userId: string): Promise<number> {
    try {
      const count = await this.prisma.notification.count({
        where: { userId },
      });
      return count;
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async cleanupOldNotifications(): Promise<{ message: string }> {
    try {
      const deletedNotifications = await this.prisma.notification.deleteMany({
        where: {
          createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      });
      return { message: `Đã xóa ${deletedNotifications.count} thông báo cũ` };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async sendNotificationAdmin(message: string): Promise<Notification[]> {
    try {
      const admins = await this.prisma.user.findMany({
        where: { role: Role.admin },
      });

      if (admins.length === 0) {
        throw new NotFoundException(
          'Không tìm thấy người dùng có vai trò admin',
        );
      }

      const notifications = await Promise.all(
        admins.map(async (admin) => {
          const notificationDto: CreateNotificationDto = {
            message,
            userId: admin.id,
            status: NotificationStatus.unread,
          };
          return await this.create(notificationDto);
        }),
      );

      return notifications;
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
