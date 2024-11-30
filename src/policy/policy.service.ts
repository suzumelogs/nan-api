import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Policy, Prisma } from '@prisma/client';
import { prismaErrorHandler } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PolicyFilterDto } from './dto/policy-filter.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

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
          orderBy: {
            createdAt: 'desc',
          },
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
      prismaErrorHandler(error);
    }
  }

  async findAll(): Promise<{ data: Policy[] }> {
    try {
      const policies = await this.prisma.policy.findMany();

      return { data: policies };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: Policy }> {
    try {
      const policy = await this.prisma.policy.findUniqueOrThrow({
        where: { id },
      });
      return { data: policy };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreatePolicyDto): Promise<Policy> {
    try {
      const newPolicy = await this.prisma.policy.create({
        data: dto,
      });
      return newPolicy;
    } catch (error) {
      prismaErrorHandler(error);
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
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.policy.delete({
        where: { id },
      });

      return { message: 'Policy deleted successfully' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
