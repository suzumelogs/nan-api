import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RentalStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

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
}
