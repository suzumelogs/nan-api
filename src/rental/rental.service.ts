import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Rental, RentalStatus } from '@prisma/client';
import { prismaErrorHandler } from 'src/common/messages';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';

@Injectable()
export class RentalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<RentalFilterDto>,
  ): Promise<{
    data: Rental[];
    total: number;
    page: number;
    limit: number;
  }> {
    const whereClause: Prisma.RentalWhereInput = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: { gte: filters.startDate } }),
      ...(filters.endDate && { endDate: { lte: filters.endDate } }),
      ...(filters.totalAmount && { totalAmount: { gte: filters.totalAmount } }),
    };

    try {
      const [data, total] = await Promise.all([
        this.prisma.rental.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
            items: {
              include: {
                equipment: true,
                package: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.rental.count({ where: whereClause }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: Rental }> {
    try {
      const rental = await this.prisma.rental.findUniqueOrThrow({
        where: { id },
        include: {
          user: true,
          items: {
            include: {
              equipment: true,
              package: true,
            },
          },
          feedbacks: true,
        },
      });
      return { data: rental };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findByMe(userId: string): Promise<{ data: Rental[] }> {
    try {
      const rentals = await this.prisma.rental.findMany({
        where: { userId },
        include: { items: true, feedbacks: true },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return { data: rentals };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.rental.delete({ where: { id } });
      return { message: 'Xóa đơn thuê thành công!' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async createRentalByMe(
    userId: string,
    createRentalDto: CreateRentalDto,
  ): Promise<Rental> {
    const { items, startDate, endDate, totalAmount, address } = createRentalDto;

    try {
      const rental = await this.prisma.rental.create({
        data: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalAmount,
          status: RentalStatus.pending,
          address,
          userId: userId,
          items: {
            create: items.map((item) => ({
              equipmentId: item.equipmentId,
              packageId: item.packageId,
              quantity: item.quantity,
              durationType: item.durationType,
              durationValue: item.durationValue,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return rental;
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  private async updateEquipmentStock(
    equipmentId: string,
    quantity: number,
    isIncrease: boolean,
  ): Promise<void> {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id: equipmentId },
    });

    if (!equipment) {
      throw new NotFoundException('Thiết bị không tồn tại.');
    }

    const newStock = isIncrease
      ? equipment.stock + quantity
      : equipment.stock - quantity;

    if (newStock < 0) {
      throw new Error('Không đủ số lượng thiết bị khả dụng.');
    }

    await this.prisma.equipment.update({
      where: { id: equipmentId },
      data: { stock: newStock },
    });
  }

  async confirmRental(id: string): Promise<Rental> {
    try {
      const rental = await this.prisma.rental.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!rental) {
        throw new NotFoundException('Không tìm thấy đơn thuê.');
      }

      if (rental.status !== RentalStatus.pending) {
        throw new Error('Chỉ có thể xác nhận đơn thuê ở trạng thái pending.');
      }

      for (const item of rental.items) {
        await this.updateEquipmentStock(item.equipmentId, item.quantity, false);
      }

      const updatedRental = await this.prisma.rental.update({
        where: { id },
        include: {
          user: true,
        },
        data: {
          status: RentalStatus.confirmed,
        },
      });

      const notificationMessage = `Đã xác nhận đơn thuê `;

      this.notificationService.sendNotification({
        message: notificationMessage,
        userId: updatedRental.userId,
      });

      return updatedRental;
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async cancelRental(id: string): Promise<{ message: string }> {
    try {
      const rental = await this.prisma.rental.findUnique({
        where: { id },
      });

      if (!rental) {
        throw new NotFoundException('Không tìm thấy đơn thuê.');
      }

      if (rental.status !== RentalStatus.pending) {
        throw new Error('Chỉ có thể hủy đơn thuê khi trạng thái là pending.');
      }

      const updatedRental = await this.prisma.rental.update({
        where: { id },
        data: { status: RentalStatus.canceled },
      });

      const notificationMessage = `Đã huỷ đơn thuê `;

      this.notificationService.sendNotification({
        message: notificationMessage,
        userId: updatedRental.userId,
      });

      return { message: 'Đơn thuê đã được hủy thành công.' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async clearAllByMe(userId: string): Promise<{ message: string }> {
    try {
      const rentals = await this.prisma.rental.findMany({
        where: { userId },
        include: { items: true },
      });

      if (!rentals.length) {
        return { message: 'Không có đơn thuê nào để xóa.' };
      }

      const rentalItemIds = rentals.flatMap((rental) =>
        rental.items.map((item) => item.id),
      );

      if (rentalItemIds.length > 0) {
        await this.prisma.rentalItem.deleteMany({
          where: { id: { in: rentalItemIds } },
        });
      }

      const rentalIds = rentals.map((rental) => rental.id);
      await this.prisma.rental.deleteMany({
        where: { id: { in: rentalIds } },
      });

      return { message: 'Đã xóa toàn bộ đơn thuê của bạn thành công.' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getRentalCountByEquipmentId(equipmentId: string): Promise<number> {
    try {
      const rentalCount = await this.prisma.rentalItem.count({
        where: {
          equipmentId,
        },
      });

      return rentalCount;
    } catch (error) {
      prismaErrorHandler(error);
      throw new Error('Lỗi khi lấy số lần thuê thiết bị.');
    }
  }

  async getRentalCountByPackageId(packageId: string): Promise<number> {
    try {
      const rentalCount = await this.prisma.rentalItem.count({
        where: {
          packageId,
        },
      });

      return rentalCount;
    } catch (error) {
      prismaErrorHandler(error);
      throw new Error('Lỗi khi lấy số lần thuê gói thiết bị.');
    }
  }

  async getRentalItemByEquipmentId(
    equipmentId: string,
  ): Promise<{ data: Rental[] }> {
    try {
      const rentalItems = await this.prisma.rentalItem.findMany({
        where: { equipmentId },
        include: {
          rental: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!rentalItems.length) {
        return { data: [] };
      }

      const rentals = rentalItems.map((item) => item.rental);

      return { data: rentals };
    } catch (error) {
      prismaErrorHandler(error);
      throw new Error('Lỗi khi lấy các mục thuê theo equipmentId.');
    }
  }

  async getRentalItemByPackageId(
    packageId: string,
  ): Promise<{ data: Rental[] }> {
    try {
      const rentalItems = await this.prisma.rentalItem.findMany({
        where: { packageId },
        include: {
          equipment: true,
          rental: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!rentalItems.length) {
        return { data: [] };
      }

      const rentals = rentalItems.map((item) => item.rental);

      return { data: rentals };
    } catch (error) {
      prismaErrorHandler(error);
      throw new Error('Lỗi khi lấy các mục thuê theo packageId.');
    }
  }
}
