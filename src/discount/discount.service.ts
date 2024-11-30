import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Discount, Prisma, Role } from '@prisma/client';
import { prismaErrorHandler } from 'src/common/messages';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { DiscountFilterDto } from './dto/discount-filter.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class DiscountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly mailService: MailService,
  ) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<DiscountFilterDto>,
  ): Promise<{ data: Discount[]; total: number; page: number; limit: number }> {
    try {
      const whereClause: Prisma.DiscountWhereInput = {
        ...(filters.code && {
          code: { contains: filters.code, mode: Prisma.QueryMode.insensitive },
        }),
        ...(filters.discountRate && { discountRate: filters.discountRate }),
        ...(filters.validFrom && {
          validFrom: { gte: new Date(filters.validFrom) },
        }),
        ...(filters.validTo && { validTo: { lte: new Date(filters.validTo) } }),
        ...(filters.maxUsage && { maxUsage: filters.maxUsage }),
        ...(filters.currentUsage && { currentUsage: filters.currentUsage }),
      };

      const [data, total] = await Promise.all([
        this.prisma.discount.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.discount.count({
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

  async findAll(): Promise<{ data: Discount[] }> {
    try {
      const discounts = await this.prisma.discount.findMany();

      return { data: discounts };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: Discount }> {
    try {
      const discount = await this.prisma.discount.findUniqueOrThrow({
        where: { id },
      });

      return { data: discount };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateDiscountDto): Promise<Discount> {
    try {
      return await this.prisma.discount.create({
        data: dto,
      });
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async update(id: string, dto: UpdateDiscountDto): Promise<Discount> {
    try {
      return await this.prisma.discount.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.discount.delete({ where: { id } });
      return { message: 'Mã giảm giá đã được xóa thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async disableExpiredDiscounts() {
    const currentDate = new Date();

    await this.prisma.discount.updateMany({
      where: {
        validTo: { lt: currentDate },
      },
      data: {
        currentUsage: 0,
        isActive: false,
      },
    });
  }

  async notifyAdminIfDiscountNearUsageLimit() {
    const discounts = await this.prisma.discount.findMany({
      where: {
        OR: [
          {
            validTo: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
          },
          {
            currentUsage: { gte: 0.8 },
          },
        ],
      },
    });

    const admins = await this.prisma.user.findMany({
      where: { role: Role.admin },
    });

    for (const discount of discounts) {
      for (const admin of admins) {
        await this.notificationService.sendNotification({
          message: `Mã giảm giá ${discount.code} sắp hết hạn hoặc đạt mức sử dụng tối đa.`,
          userId: admin.id,
        });
      }
    }
  }

  async notifyUsersAboutUpcomingDiscounts() {
    const currentDate = new Date();
    const upcomingDiscounts = await this.prisma.discount.findMany({
      where: {
        AND: [
          {
            validFrom: {
              gte: currentDate,
            },
          },
          {
            validFrom: {
              lte: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
          },
        ],
        isActive: true,
      },
    });

    const users = await this.prisma.user.findMany();
    for (const discount of upcomingDiscounts) {
      for (const user of users) {
        await this.notificationService.sendNotification({
          message: `Mã giảm giá ${discount.code} sẽ có hiệu lực từ ${discount.validFrom}. Hãy chuẩn bị sử dụng!`,
          userId: user.id,
        });
      }
    }
  }

  // async notifyUsersAboutUpcomingDiscounts() {
  //   const currentDate = new Date();
  //   const upcomingDiscounts = await this.prisma.discount.findMany({
  //     where: {
  //       AND: [
  //         { validFrom: { gte: currentDate } },
  //         {
  //           validFrom: {
  //             lte: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000),
  //           },
  //         },
  //       ],
  //       isActive: true,
  //     },
  //   });

  //   const users = await this.prisma.user.findMany({
  //     where: { email: { not: null } },
  //   });

  //   for (const discount of upcomingDiscounts) {
  //     for (const user of users) {
  //       await this.mailService.sendUpcomingDiscountEmail(
  //         user.email,
  //         discount.code,
  //         discount.validFrom,
  //       );
  //     }
  //   }
  // }
}
