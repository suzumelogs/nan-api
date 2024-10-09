import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { Policy } from './entities/policy.entity';

@Injectable()
export class PolicyService {
  constructor(private readonly prisma: PrismaService) {}

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
