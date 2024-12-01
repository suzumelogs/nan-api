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
import { Feedback, Role, User } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackFilterDto } from './dto/feedback-filter.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackItemDto } from './dto/create-feedback-item.dto';

@ApiBearerAuth()
@ApiTags('Feedbacks')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả phản hồi (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: FeedbackFilterDto,
  ): Promise<{ data: Feedback[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.feedbackService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Tất cả phản hồi (Không phân trang)',
  })
  findAll(): Promise<{ data: Feedback[] }> {
    return this.feedbackService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Phản hồi theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Feedback }> {
    return this.feedbackService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo phản hồi mới',
  })
  @Auth(Role.user)
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<{ message: string }> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật phản hồi theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<{ message: string }> {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete('remove/:id')
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
  @Auth(Role.admin, Role.super_admin)
  async reply(
    @Param('id') id: string,
    @Body() replyDto: { adminResponse: string; replyDate: Date },
  ): Promise<{ message: string }> {
    return this.feedbackService.reply(id, replyDto);
  }

  @Get('user')
  @ApiOperation({
    summary: 'Tìm phản hồi của người dùng theo userId',
  })
  @Auth(Role.user)
  async findByUser(@GetUser() user: User): Promise<{ data: Feedback[] }> {
    return this.feedbackService.findByUser(user.id);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Thống kê tổng quan về feedback',
  })
  @Auth(Role.admin, Role.super_admin)
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
  @Auth(Role.admin, Role.super_admin)
  async findRepliedFeedbacks(): Promise<{ data: Feedback[] }> {
    return this.feedbackService.findRepliedFeedbacks();
  }

  @Get('average-rating')
  @ApiOperation({
    summary: 'Tính điểm đánh giá trung bình của tất cả phản hồi',
  })
  @Auth(Role.admin, Role.super_admin)
  async averageRating(): Promise<{ average: number }> {
    return this.feedbackService.averageRating();
  }

  @Get('rating-breakdown')
  @ApiOperation({
    summary: 'Phân tích số lượng phản hồi theo điểm đánh giá',
  })
  @Auth(Role.admin, Role.super_admin)
  async getRatingBreakdown(): Promise<{
    ratingCounts: Record<number, number>;
  }> {
    return this.feedbackService.getRatingBreakdown();
  }

  @Get('date-range')
  @ApiOperation({
    summary: 'Lấy phản hồi trong một khoảng ngày cụ thể',
  })
  @Auth(Role.admin, Role.super_admin)
  async findFeedbacksByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ data: Feedback[] }> {
    return this.feedbackService.findFeedbacksByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Patch(':id/admin-response')
  @ApiOperation({
    summary: 'Cập nhật phản hồi admin',
  })
  @Auth(Role.admin, Role.super_admin)
  async updateAdminResponse(
    @Param('id') id: string,
    @Body() replyDto: { adminResponse: string; replyDate: Date },
  ): Promise<{ message: string }> {
    return this.feedbackService.updateAdminResponse(id, replyDto);
  }

  @Post('create/rental-item')
  @ApiOperation({
    summary: 'Tạo phản hồi mới cho thiết bị và gói đã thuê',
  })
  @Auth(Role.user)
  async createFeedback(@Body() dto: CreateFeedbackItemDto) {
    return this.feedbackService.createFeedbackForRentalItem(dto);
  }

  @Get('by-equipment-or-package')
  @ApiOperation({
    summary: 'Lấy feedbacks theo equipmentId hoặc packageId',
  })
  async getFeedbacksByEquipmentIdOrPackageId(
    @Query('equipmentId') equipmentId?: string,
    @Query('packageId') packageId?: string,
  ) {
    return this.feedbackService.getFeedbacksByEquipmentIdOrPackageId(
      equipmentId,
      packageId,
    );
  }
}
