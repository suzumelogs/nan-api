import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackFilterDto } from './dto/feedback-filter.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPagination(
    page: number,
    limit: number,
    filters: Partial<FeedbackFilterDto>,
  ): Promise<{ data: Feedback[]; total: number; page: number; limit: number }> {
    try {
      const whereClause: Prisma.FeedbackWhereInput = {
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.comment && {
          comment: { contains: filters.comment, mode: 'insensitive' },
        }),
        ...(filters.adminResponse && {
          adminResponse: {
            contains: filters.adminResponse,
            mode: 'insensitive',
          },
        }),
      };

      const [data, total] = await Promise.all([
        this.prisma.feedback.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.feedback.count({
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
        'Failed to retrieve feedback with pagination and filters',
      );
    }
  }

  async findAll(): Promise<Feedback[]> {
    try {
      return await this.prisma.feedback.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve feedbacks');
    }
  }

  async findOne(id: string): Promise<Feedback> {
    try {
      const feedback = await this.prisma.feedback.findUniqueOrThrow({
        where: { id },
      });
      return feedback;
    } catch (error) {
      throw new NotFoundException('Feedback not found');
    }
  }

  async create(dto: CreateFeedbackDto): Promise<Feedback> {
    try {
      const newFeedback = await this.prisma.feedback.create({
        data: dto,
      });
      return newFeedback;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create feedback');
    }
  }

  async update(id: string, dto: UpdateFeedbackDto): Promise<Feedback> {
    try {
      const updatedFeedback = await this.prisma.feedback.update({
        where: { id },
        data: dto,
      });
      return updatedFeedback;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Feedback not found');
      }
      throw new InternalServerErrorException('Failed to update feedback');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.feedback.delete({
        where: { id },
      });
      return { message: 'Feedback deleted successfully' };
    } catch (error) {
      throw new NotFoundException('Feedback not found');
    }
  }
}
