import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Discount } from './entities/discount.entity';
import { QueryService } from 'src/common/services/query.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class DiscountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryService: QueryService,
  ) {}

  async findAllWithPagination(paginationDto: QueryDto) {
    const searchConfig = {
      user: ['code', 'discountRate'],
    };

    const filterConfig = {
      code: paginationDto.code,
      discountRate: paginationDto.discountRate,
    };

    return this.queryService.list(
      'discount',
      paginationDto,
      searchConfig,
      filterConfig,
    );
  }

  async findAll(): Promise<Discount[]> {
    try {
      return await this.prisma.discount.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve discounts');
    }
  }

  async findOne(id: string): Promise<Discount> {
    try {
      return await this.prisma.discount.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Discount not found');
    }
  }

  async create(dto: CreateDiscountDto): Promise<Discount> {
    try {
      return await this.prisma.discount.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create discount');
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
        throw new NotFoundException('Discount not found');
      }
      throw new InternalServerErrorException('Failed to update discount');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.discount.delete({ where: { id } });
      return { message: 'Discount deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Discount not found');
      }
      throw new InternalServerErrorException('Failed to delete discount');
    }
  }
}
