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
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackFilterDto } from './dto/feedback-filter.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { FeedbackService } from './feedback.service';

@ApiBearerAuth()
@ApiTags('Feedbacks')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('pagination')
  @ApiOperation({
    summary: 'Lấy tất cả phản hồi (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: FeedbackFilterDto,
  ): Promise<{ data: Feedback[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.feedbackService.findAllPagination(page, limit, filters);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả phản hồi (Không phân trang)',
  })
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy phản hồi theo ID',
  })
  findOne(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo phản hồi mới',
  })
  create(@Body() createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật phản hồi theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa phản hồi theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.feedbackService.remove(id);
  }
}
