import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Rental, RentalStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddItemToRentalDto } from './dto/add-item-to-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';
import { UpdateRentalStatusDto } from './dto/update-rental-status.dto';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  private handlePrismaError(error: any): never {
    if (error.code === 'P2025') {
      throw new NotFoundException('Không tìm thấy');
    }
    throw new InternalServerErrorException(error.message || 'Lỗi máy chủ');
  }

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
        }),
        this.prisma.rental.count({ where: whereClause }),
      ]);

      return { data, total, page, limit };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findOne(id: string): Promise<{ data: Rental }> {
    try {
      const rental = await this.prisma.rental.findUniqueOrThrow({
        where: { id },
        include: { user: true, items: true, feedbacks: true },
      });
      return { data: rental };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async createByMe(
    userId: string,
    createRentalDto: CreateRentalDto,
  ): Promise<{ message: string }> {
    const { startDate, endDate, items, totalAmount } = createRentalDto;

    try {
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
      this.handlePrismaError(error);
    }
  }

  async updateRentalStatus(
    rentalId: string,
    updateRentalStatusDto: UpdateRentalStatusDto,
  ): Promise<{ message: string }> {
    const { status } = updateRentalStatusDto;

    try {
      const rental = await this.prisma.rental.findUniqueOrThrow({
        where: { id: rentalId },
        include: { items: true },
      });

      if (status === RentalStatus.confirmed) {
        await this.decreaseStock(rental.items);
      } else if (status === RentalStatus.canceled) {
        await this.increaseStock(rental.items);
      }

      await this.prisma.rental.update({
        where: { id: rentalId },
        data: { status },
      });

      return { message: 'Cập nhật trạng thái thành công!' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private async decreaseStock(
    items: Array<{ equipmentId: string; quantity: number }>,
  ) {
    for (const item of items) {
      const equipment = await this.prisma.equipment.findUnique({
        where: { id: item.equipmentId },
      });

      if (!equipment) {
        throw new NotFoundException(
          `Không tìm thấy thiết bị với ID: ${item.equipmentId}`,
        );
      }

      if (equipment.stock < item.quantity) {
        throw new Error(
          `Không đủ số lượng hàng trong kho cho thiết bị ID: ${item.equipmentId}`,
        );
      }

      await this.prisma.equipment.update({
        where: { id: item.equipmentId },
        data: { stock: equipment.stock - item.quantity },
      });
    }
  }

  private async increaseStock(
    items: Array<{ equipmentId: string; quantity: number }>,
  ) {
    for (const item of items) {
      await this.prisma.equipment.update({
        where: { id: item.equipmentId },
        data: { stock: { increment: item.quantity } },
      });
    }
  }

  async findByMe(userId: string): Promise<{ data: Rental[] }> {
    try {
      const rentals = await this.prisma.rental.findMany({
        where: { userId },
        include: { items: true, feedbacks: true },
      });
      return { data: rentals };
    } catch (error) {
      this.handlePrismaError(error);
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

      return { message: 'Thêm item vào đơn thuê thành công!' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.rental.delete({ where: { id } });
      return { message: 'Xóa đơn thuê thành công!' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
