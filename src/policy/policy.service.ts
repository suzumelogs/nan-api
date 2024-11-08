import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PolicyFilterDto } from './dto/policy-filter.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { Policy } from './entities/policy.entity';

@Injectable()
export class PolicyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<PolicyFilterDto>,
  ): Promise<{ data: Policy[]; total: number; page: number; limit: number }> {
    try {
      const whereClause: Prisma.PolicyWhereInput = {
        ...(filters.description && {
          description: { contains: filters.description, mode: 'insensitive' },
        }),
        ...(filters.depositRate && { depositRate: filters.depositRate }),
        ...(filters.damageProcessingFee && {
          damageProcessingFee: filters.damageProcessingFee,
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.policy.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.policy.count({
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
        'Failed to retrieve policies with pagination and filters',
      );
    }
  }

  async findAll(): Promise<Policy[]> {
    try {
      return await this.prisma.policy.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve policies');
    }
  }

  async findOne(id: string): Promise<Policy> {
    try {
      const policy = await this.prisma.policy.findUniqueOrThrow({
        where: { id },
      });
      return policy;
    } catch (error) {
      throw new NotFoundException('Policy not found');
    }
  }

  async create(dto: CreatePolicyDto): Promise<Policy> {
    try {
      const newPolicy = await this.prisma.policy.create({
        data: dto,
      });
      return newPolicy;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create policy');
    }
  }

  async update(id: string, dto: UpdatePolicyDto): Promise<Policy> {
    try {
      const updatedPolicy = await this.prisma.policy.update({
        where: { id },
        data: dto,
      });
      return updatedPolicy;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Policy not found');
      }
      throw new InternalServerErrorException('Failed to update policy');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.policy.delete({
        where: { id },
      });
      return { message: 'Policy deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Policy not found');
    }
  }
}
