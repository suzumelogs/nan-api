import { Injectable } from '@nestjs/common';
import { Feedback, Prisma } from '@prisma/client';
import { prismaErrorHandler } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackFilterDto } from './dto/feedback-filter.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

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
      prismaErrorHandler(error);
    }
  }

  async findAll(): Promise<{ data: Feedback[] }> {
    try {
      const feedbacks = await this.prisma.feedback.findMany();

      return { data: feedbacks };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findOne(id: string): Promise<{ data: Feedback }> {
    try {
      const feedback = await this.prisma.feedback.findUniqueOrThrow({
        where: { id },
      });

      return { data: feedback };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async create(dto: CreateFeedbackDto): Promise<{ message: string }> {
    try {
      await this.prisma.feedback.create({
        data: dto,
      });

      return { message: 'Thêm mới thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async update(
    id: string,
    dto: UpdateFeedbackDto,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.feedback.update({
        where: { id },
        data: dto,
      });

      return { message: 'Cập nhật thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prisma.feedback.delete({
        where: { id },
      });

      return { message: 'Xóa thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async reply(
    id: string,
    dto: { adminResponse: string; replyDate: Date },
  ): Promise<{ message: string }> {
    try {
      await this.prisma.feedback.update({
        where: { id },
        data: {
          adminResponse: dto.adminResponse,
          replyDate: dto.replyDate,
        },
      });

      return { message: 'Phản hồi thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findByUser(userId: string): Promise<{ data: Feedback[] }> {
    try {
      const feedbacks = await this.prisma.feedback.findMany({
        where: { userId },
      });

      return { data: feedbacks };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async averageRating(): Promise<{ average: number }> {
    try {
      const feedbacks = await this.prisma.feedback.findMany();
      const totalRating = feedbacks.reduce(
        (sum, feedback) => sum + feedback.rating,
        0,
      );
      const average = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;

      return { average };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findByRental(rentalId: string): Promise<{ data: Feedback[] }> {
    try {
      const feedbacks = await this.prisma.feedback.findMany({
        where: { rentalId },
      });

      return { data: feedbacks };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findRepliedFeedbacks(): Promise<{ data: Feedback[] }> {
    try {
      const feedbacks = await this.prisma.feedback.findMany({
        where: {
          NOT: {
            replyDate: null,
          },
        },
      });

      return { data: feedbacks };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async feedbackStatistics(): Promise<{
    total: number;
    ratingCounts: Record<number, number>;
  }> {
    try {
      const feedbacks = await this.prisma.feedback.findMany();
      const ratingCounts = feedbacks.reduce(
        (acc, feedback) => {
          acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      return { total: feedbacks.length, ratingCounts };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getRatingBreakdown(): Promise<{
    ratingCounts: Record<number, number>;
  }> {
    try {
      const feedbacks = await this.prisma.feedback.findMany();
      const ratingCounts = feedbacks.reduce(
        (acc, feedback) => {
          acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      return { ratingCounts };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async findFeedbacksByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<{ data: Feedback[] }> {
    try {
      const feedbacks = await this.prisma.feedback.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return { data: feedbacks };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async updateAdminResponse(
    id: string,
    dto: { adminResponse: string; replyDate: Date },
  ): Promise<{ message: string }> {
    try {
      await this.prisma.feedback.update({
        where: { id },
        data: {
          adminResponse: dto.adminResponse,
          replyDate: dto.replyDate,
        },
      });
      return { message: 'Cập nhật phản hồi admin thành công' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }
}
