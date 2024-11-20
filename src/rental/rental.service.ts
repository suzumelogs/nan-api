import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Rental, RentalStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTtemToRentalDto } from './dto/add-item-to-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';
import { UpdateRentalStatusDto } from './dto/update-rental-status.dto';

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
      console.log(error);

      throw new InternalServerErrorException('Lỗi khi lấy danh sách đơn thuê');
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
      throw new NotFoundException('Không tìm thấy đơn thuê');
    }
  }

  async createRental(
    userId: string,
    createRentalDto: CreateRentalDto,
  ): Promise<Rental> {
    try {
      const { startDate, endDate, items, totalAmount } = createRentalDto;

      const rental = await this.prisma.rental.create({
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

      return rental;
    } catch (error) {
      throw new Error('Lỗi khi tạo đơn thuê');
    }
  }

  async updateRentalStatus(
    rentalId: string,
    updateRentalStatusDto: UpdateRentalStatusDto,
  ) {
    try {
      const { status } = updateRentalStatusDto;

      const rental = await this.prisma.rental.update({
        where: { id: rentalId },
        data: { status },
      });

      return rental;
    } catch (error) {
      throw new NotFoundException(
        'Không tìm thấy đơn thuê để cập nhật trạng thái',
      );
    }
  }

  async getRentalsByUser(userId: string): Promise<{ data: Rental[] }> {
    try {
      const rentals = await this.prisma.rental.findMany({
        where: { userId },
        include: { items: true, feedbacks: true },
      });

      return { data: rentals };
    } catch (error) {
      console.log(error);

      throw new Error('Lỗi khi lấy thông tin đơn thuê của người dùng');
    }
  }

  async addItemToRental(
    rentalId: string,
    addTtemToRentalDto: AddTtemToRentalDto,
  ) {
    const {
      equipmentId,
      packageId,
      quantity,
      durationType,
      durationValue,
      price,
    } = addTtemToRentalDto;

    try {
      const rentalItem = await this.prisma.rentalItem.create({
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

      return rentalItem;
    } catch (error) {
      throw new Error('Lỗi khi thêm item vào đơn thuê');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.rental.delete({ where: { id } });
      return { message: 'Xóa đơn thuê thành công' };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy đơn thuê');
    }
  }
}
