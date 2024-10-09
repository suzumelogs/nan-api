import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

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
