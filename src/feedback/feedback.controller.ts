import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Feedback } from '@prisma/client';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackFilterDto } from './dto/feedback-filter.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiBearerAuth()
@ApiTags('Feedbacks')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('pagination')
  @ApiOperation({
    summary: 'Tất cả phản hồi (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: FeedbackFilterDto,
  ): Promise<{ data: Feedback[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.feedbackService.findAllPagination(page, limit, filters);
  }

  @Get()
  @ApiOperation({
    summary: 'Tất cả phản hồi (Không phân trang)',
  })
  findAll(): Promise<{ data: Feedback[] }> {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Phản hồi theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Feedback }> {
    return this.feedbackService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo phản hồi mới',
  })
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<{ message: string }> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật phản hồi theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<{ message: string }> {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa phản hồi theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.feedbackService.remove(id);
  }

  @Patch(':id/reply')
  @ApiOperation({
    summary: 'Phản hồi từ admin',
  })
  async reply(
    @Param('id') id: string,
    @Body() replyDto: { adminResponse: string; replyDate: Date },
  ): Promise<{ message: string }> {
    return this.feedbackService.reply(id, replyDto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Tìm phản hồi của người dùng theo userId',
  })
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<{ data: Feedback[] }> {
    return this.feedbackService.findByUser(userId);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Thống kê tổng quan về feedback',
  })
  async feedbackStatistics(): Promise<{
    total: number;
    ratingCounts: Record<number, number>;
  }> {
    return this.feedbackService.feedbackStatistics();
  }

  @Get('rental/:rentalId')
  @ApiOperation({
    summary: 'Lấy phản hồi theo rentalId',
  })
  async findByRental(
    @Param('rentalId') rentalId: string,
  ): Promise<{ data: Feedback[] }> {
    return this.feedbackService.findByRental(rentalId);
  }

  @Get('replied')
  @ApiOperation({
    summary: 'Lấy các phản hồi đã được trả lời',
  })
  async findRepliedFeedbacks(): Promise<{ data: Feedback[] }> {
    return this.feedbackService.findRepliedFeedbacks();
  }

  @Get('average-rating')
  @ApiOperation({
    summary: 'Tính điểm đánh giá trung bình của tất cả phản hồi',
  })
  async averageRating(): Promise<{ average: number }> {
    return this.feedbackService.averageRating();
  }
}
