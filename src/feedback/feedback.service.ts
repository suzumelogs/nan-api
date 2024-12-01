import { Injectable } from '@nestjs/common';
import { Feedback, Prisma } from '@prisma/client';
import { prismaErrorHandler } from 'src/common/messages';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackFilterDto } from './dto/feedback-filter.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { CreateFeedbackItemDto } from './dto/create-feedback-item.dto';

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
          orderBy: {
            createdAt: 'desc',
          },
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
    dto: { adminResponse: string },
  ): Promise<{ message: string }> {
    try {
      await this.prisma.feedback.update({
        where: { id },
        data: {
          adminResponse: dto.adminResponse,
          replyDate: new Date(),
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

  async createFeedbackForRentalItem(
    dto: CreateFeedbackItemDto,
  ): Promise<{ message: string }> {
    try {
      const rentalItem = await this.prisma.rentalItem.findUnique({
        where: { id: dto.rentalItemId },
      });

      if (!rentalItem) {
        throw new Error('Rental item không tồn tại.');
      }

      const rental = await this.prisma.rental.findUnique({
        where: { id: rentalItem.rentalId },
      });

      if (!rental || rental.userId !== dto.userId) {
        throw new Error('Bạn không có quyền đánh giá thiết bị này.');
      }

      await this.prisma.feedback.create({
        data: {
          rentalItemId: dto.rentalItemId,
          userId: dto.userId,
          rating: dto.rating,
          comment: dto.comment,
          rentalId: rentalItem.rentalId,
        },
      });

      return { message: 'Thêm feedback thành công.' };
    } catch (error) {
      prismaErrorHandler(error);
    }
  }

  async getFeedbacksByEquipmentIdOrPackageId(
    equipmentId?: string,
    packageId?: string,
  ) {
    if (!equipmentId && !packageId) {
      throw new Error('Either equipmentId or packageId must be provided');
    }

    let rentalItemIds: string[] = [];

    if (equipmentId) {
      const rentalItems = await this.prisma.rentalItem.findMany({
        where: {
          equipmentId: equipmentId,
        },
        select: {
          id: true,
        },
      });

      rentalItemIds = rentalItems.map((item) => item.id);
    }

    if (packageId) {
      const rentalItemsByPackage = await this.prisma.rentalItem.findMany({
        where: {
          packageId: packageId,
        },
        select: {
          id: true,
        },
      });

      rentalItemIds = [
        ...rentalItemIds,
        ...rentalItemsByPackage.map((item) => item.id),
      ];
    }

    if (rentalItemIds.length === 0) {
      return [];
    }

    const feedbacks = await this.prisma.feedback.findMany({
      where: {
        rentalItemId: {
          in: rentalItemIds,
        },
      },
      include: {
        rentalItem: true,
        user: true,
      },
    });

    return feedbacks;
  }
}
