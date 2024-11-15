import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Rental, RentalStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CalculateRentalDto } from './dto/calculat-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<RentalFilterDto>,
  ): Promise<{ data: Rental[]; total: number; page: number; limit: number }> {
    try {
      const whereClause: Prisma.RentalWhereInput = {
        ...(filters.status && { status: filters.status }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.deviceId && { deviceId: filters.deviceId }),
        ...(filters.rentalStartDate && {
          rentalStartDate: { gte: filters.rentalStartDate },
        }),
        ...(filters.rentalEndDate && {
          rentalEndDate: { lte: filters.rentalEndDate },
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
      throw new Error('Failed to retrieve rentals with pagination and filters');
    }
  }

  async findAll(): Promise<Rental[]> {
    try {
      return await this.prisma.rental.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve rentals');
    }
  }

  async findOne(id: string): Promise<Rental> {
    try {
      const rental = await this.prisma.rental.findUniqueOrThrow({
        where: { id },
      });
      return rental;
    } catch (error) {
      throw new NotFoundException('Rental not found');
    }
  }

  async create(dto: CreateRentalDto): Promise<Rental> {
    try {
      const newRental = await this.prisma.rental.create({
        data: dto,
      });
      return newRental;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create rental');
    }
  }

  async update(id: string, dto: UpdateRentalDto): Promise<Rental> {
    try {
      const updatedRental = await this.prisma.rental.update({
        where: { id },
        data: dto,
      });
      return updatedRental;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Rental not found');
      }
      throw new InternalServerErrorException('Failed to update rental');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.rental.delete({
        where: { id },
      });
      return { message: 'Rental deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Rental not found');
    }
  }

  async getHistoryByMe(userId: string): Promise<Rental[]> {
    try {
      return await this.prisma.rental.findMany({
        where: {
          userId: userId,
          status: {
            in: [RentalStatus.completed, RentalStatus.canceled],
          },
        },
        include: {
          device: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve rental history',
      );
    }
  }

  async calculateRental(dto: CalculateRentalDto) {
    try {
      const rentalStartDate = new Date(dto.rentalStartDate);
      const rentalEndDate = new Date(dto.rentalEndDate);
      const days = Math.ceil(
        (rentalEndDate.getTime() - rentalStartDate.getTime()) /
          (1000 * 3600 * 24),
      );

      if (days <= 0) {
        throw new BadRequestException(
          'Ngày kết thúc phải lớn hơn ngày bắt đầu.',
        );
      }

      let totalPrice = 0;

      const devices = await this.prisma.device.findMany({
        where: {
          id: { in: dto.deviceIds },
        },
      });

      for (const device of devices) {
        const devicePrice = this.calculateTotalPrice(
          device.priceDay,
          device.priceWeek,
          device.priceMonth,
          days,
        );
        totalPrice += devicePrice;
      }

      if (dto.packageIds && dto.packageIds.length > 0) {
        const packages = await this.prisma.package.findMany({
          where: {
            id: { in: dto.packageIds },
          },
        });

        for (const pkg of packages) {
          const packagePrice = this.calculateTotalPrice(
            pkg.priceDay,
            pkg.priceWeek,
            pkg.priceMonth,
            days,
          );
          totalPrice += packagePrice;
        }
      }

      return { totalPrice };
    } catch (error) {
      throw new InternalServerErrorException('Không thể tính toán giá thuê');
    }
  }

  private calculateTotalPrice(
    priceDay: number,
    priceWeek: number,
    priceMonth: number,
    days: number,
  ): number {
    let totalPrice = 0;

    if (days <= 7) {
      totalPrice = days * priceDay;
    } else if (days <= 30) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      totalPrice = weeks * priceWeek + remainingDays * priceDay;
    } else {
      const months = Math.floor(days / 30);
      const remainingDaysAfterMonths = days % 30;
      const weeks = Math.floor(remainingDaysAfterMonths / 7);
      const remainingDays = remainingDaysAfterMonths % 7;

      totalPrice =
        months * priceMonth + weeks * priceWeek + remainingDays * priceDay;
    }

    return totalPrice;
  }
}
