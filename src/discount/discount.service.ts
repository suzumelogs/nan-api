import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { DiscountFilterDto } from './dto/discount-filter.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
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
      throw new InternalServerErrorException(
        'Failed to retrieve discounts with pagination and filters',
      );
    }
  }

  async findAll(): Promise<Discount[]> {
    try {
      return await this.prisma.discount.findMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Không thể lấy danh sách mã giảm giá',
      );
    }
  }

  async findOne(id: string): Promise<Discount> {
    try {
      return await this.prisma.discount.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Mã giảm giá không được tìm thấy');
    }
  }

  async create(dto: CreateDiscountDto): Promise<Discount> {
    try {
      return await this.prisma.discount.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Tạo mã giảm giá không thành công',
      );
    }
  }

  async update(id: string, dto: UpdateDiscountDto): Promise<Discount> {
    try {
      return await this.prisma.discount.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Mã giảm giá không được tìm thấy');
      }
      throw new InternalServerErrorException(
        'Cập nhật mã giảm giá không thành công',
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.discount.delete({ where: { id } });
      return { message: 'Mã giảm giá đã được xóa thành công' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Mã giảm giá không được tìm thấy');
      }
      throw new InternalServerErrorException('Xoá mã giảm giá thất bại');
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
}
