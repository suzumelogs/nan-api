import { Injectable } from '@nestjs/common';
import { DamageReport, DamageReportStatus, Prisma } from '@prisma/client';
import { prismaErrorHandler } from 'src/common/messages';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDamageReportDto } from './dto/create-damage-report.dto';
import { DamageReportFilterDto } from './dto/damage-report-filter.dto';
import { UpdateStatus } from './dto/update-status.dto';

@Injectable()
export class DamageReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<DamageReportFilterDto>,
  ): Promise<{
    data: DamageReport[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const whereClause: Prisma.DamageReportWhereInput = {
        ...(filters.description && {
          description: {
            contains: filters.description,
            mode: Prisma.QueryMode.insensitive,
          },
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.damageReport.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
            equipment: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.damageReport.count({
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

  async findOne(id: string) {
    try {
      const damageReport = await this.prisma.damageReport.findUnique({
        where: { id },
        include: {
          equipment: true,
          user: true,
        },
      });

      return { data: damageReport };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async createByUser(userId: string, dto: CreateDamageReportDto) {
    try {
      const createdDamageReport = await this.prisma.damageReport.create({
        data: {
          description: dto.description,
          image: dto.image,
          equipmentId: dto.equipmentId,
          userId,
        },
        include: {
          user: {
            select: { name: true },
          },
          equipment: {
            select: { name: true },
          },
        },
      });

      const notificationMessage = `(Báo hỏng)Người dùng ${createdDamageReport.user.name} đã báo hỏng thiết bị ${createdDamageReport.equipment.name}`;
      this.notificationService.sendNotificationAdmin(notificationMessage);

      return { message: 'Báo hỏng thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async updateStatus(id: string, dto: UpdateStatus) {
    try {
      // Cập nhật trạng thái của báo cáo hư hỏng
      const damageReport = await this.prisma.damageReport.update({
        where: { id },
        data: {
          status: dto.status,
        },
        include: {
          user: {
            select: { id: true },
          },
          equipment: {
            select: { name: true },
          },
        },
      });

      let notificationMessage: string;

      switch (dto.status) {
        case DamageReportStatus.normal:
          notificationMessage = `(Báo hỏng) Thiết bị ${damageReport.equipment.name} đang ở trạng thái hư hỏng nhẹ sẽ sửa chữa với phí 10%-30% giá trị sản phẩm.`;
          break;

        case DamageReportStatus.heavy:
          notificationMessage = `(Báo hỏng) Thiết bị ${damageReport.equipment.name} đang ở trạng thái hư hỏng nghiêm trọng sẽ đền bù 80%-100% giá trị sản phẩm.`;
          break;

        case DamageReportStatus.pending:
          notificationMessage = `(Báo hỏng) Thiết bị ${damageReport.equipment.name} đang ở trạng thái chờ xử lý. Vui lòng kiểm tra sau.`;
          break;

        case DamageReportStatus.canceled:
          notificationMessage = `(Báo hỏng) Báo cáo về thiết bị ${damageReport.equipment.name} đã bị hủy bỏ.`;
          break;

        default:
          notificationMessage = `(Báo hỏng) Thiết bị ${damageReport.equipment.name} đang ở trạng thái ${dto.status}.`;
          break;
      }

      this.notificationService.sendNotification({
        message: notificationMessage,
        userId: damageReport.user.id,
      });

      if (dto.status === DamageReportStatus.canceled) {
        await this.remove(id);
        return { message: 'Báo cáo hư hỏng đã bị hủy bỏ và xóa thành công' };
      }

      return { message: 'Cập nhật trạng thái thành công' };
    } catch (error) {
      // Xử lý lỗi từ Prisma
      prismaErrorHandler(error);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.damageReport.delete({
        where: { id },
      });

      return { message: 'Xóa báo cáo hư hỏng thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findByUser(userId: string) {
    try {
      const damageReports = await this.prisma.damageReport.findMany({
        where: { userId },
        include: {
          equipment: true,
        },
      });
      return { data: damageReports };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
