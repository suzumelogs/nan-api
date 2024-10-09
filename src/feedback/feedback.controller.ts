import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@ApiBearerAuth()
@ApiTags('Feedbacks')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all feedbacks',
    description: 'Retrieve a list of all feedbacks.',
  })
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get feedback by ID',
    description: 'Retrieve feedback details by its ID.',
  })
  findOne(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new feedback',
    description: 'Create a new feedback with the provided details.',
  })
  create(@Body() createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update feedback by ID',
    description: 'Update the details of an existing feedback by its ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete feedback by ID',
    description: 'Delete a feedback by its ID.',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.feedbackService.remove(id);
  }
}
