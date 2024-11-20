import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Rental, RentalStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';
import { UpdateRentalStatusDto } from './dto/update-rental-status.dto';
import { AddItemToRentalDto } from './dto/add-item-to-rental.dto';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

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
    try {
      const whereClause: Prisma.RentalWhereInput = {
        ...(filters.userId && {
          userId: filters.userId,
        }),
        ...(filters.status && {
          status: filters.status,
        }),
        ...(filters.startDate && {
          startDate: { gte: filters.startDate },
        }),
        ...(filters.endDate && {
          endDate: { lte: filters.endDate },
        }),
        ...(filters.totalAmount && {
          totalAmount: { gte: filters.totalAmount },
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.rental.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.rental.count({
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
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<{ data: Rental }> {
    try {
      const rental = await this.prisma.rental.findUniqueOrThrow({
        where: { id },
        include: {
          user: true,
          items: true,
          feedbacks: true,
        },
      });
      return { data: rental };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Không tìm thấy');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async createRental(
    userId: string,
    createRentalDto: CreateRentalDto,
  ): Promise<{ message: string }> {
    try {
      const { startDate, endDate, items, totalAmount } = createRentalDto;

      await this.prisma.rental.create({
        data: {
          userId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalAmount,
          status: RentalStatus.pending,
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
      });

      return {
        message: 'Thuê thành công. Vui lòng đợi quản trị viên phê duyệt!',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateRentalStatus(
    rentalId: string,
    updateRentalStatusDto: UpdateRentalStatusDto,
  ): Promise<{ message: string }> {
    try {
      const { status } = updateRentalStatusDto;

      const rental = await this.prisma.rental.update({
        where: { id: rentalId },
        data: { status },
      });

      return {
        message: 'Cập nhật thành công. Vui lòng đợi quản trị viên phê duyệt!',
      };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findRentalByMe(userId: string): Promise<{ data: Rental[] }> {
    try {
      const rentals = await this.prisma.rental.findMany({
        where: { userId },
        include: { items: true, feedbacks: true },
      });

      return { data: rentals };
    } catch (error) {
      throw new Error(error);
    }
  }

  async addItemToRental(
    rentalId: string,
    addItemToRentalDto: AddItemToRentalDto,
  ): Promise<{ message: string }> {
    const {
      equipmentId,
      packageId,
      quantity,
      durationType,
      durationValue,
      price,
    } = addItemToRentalDto;

    try {
      await this.prisma.rentalItem.create({
        data: {
          rentalId,
          equipmentId,
          packageId,
          quantity,
          durationType,
          durationValue,
          price,
        },
      });

      return {
        message: 'Thêm thành công. Vui lòng đợi quản trị viên phê duyệt!',
      };
    } catch (error) {
      throw new Error('Lỗi khi thêm item vào đơn thuê');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.rental.delete({ where: { id } });
      return { message: 'Xóa thành công' };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
