import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../dtos/pagination.dto';

@Injectable()
export class QueryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    model: string,
    paginationDto: PaginationDto,
    searchConfig: Record<string, string[]>,
    filterConfig: Record<string, any> = {},
  ) {
    const { page = 1, limit = 10, ...searchParams } = paginationDto;
    const skip = (page - 1) * limit;

    const searchFields = searchConfig[model] || [];
    const where: Record<string, any> = { ...filterConfig };

    const searchConditions = searchFields.reduce(
      (acc, field) => {
        if (searchParams[field]) {
          acc[field] = {
            contains: searchParams[field],
            mode: 'insensitive',
          };
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    Object.assign(where, searchConditions);

    const [total, data] = await Promise.all([
      this.prisma[model].count({ where }),
      this.prisma[model].findMany({
        where,
        skip,
        take: limit,
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
