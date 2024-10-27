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
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all notifications',
    description: 'Retrieve a list of all notifications available.',
  })
  findAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get notification by ID',
    description: 'Retrieve notification details by its ID.',
  })
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new notification',
    description: 'Create a new notification with the provided details.',
  })
  create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationService.create(createNotificationDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update notification by ID',
    description: 'Update the details of an existing notification by its ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete notification by ID',
    description: 'Delete a notification by its ID.',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.notificationService.remove(id);
  }

  @Get('by-me')
  @ApiOperation({
    summary: 'Get notifications by me',
    description: 'Retrieve a list of all notifications for a specific by me.',
  })
  findByUserId(@GetUser() user: User): Promise<Notification[]> {
    return this.notificationService.findByUserId(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Mark notification as read',
    description: 'Update the notification status to read.',
  })
  markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.markAsRead(id);
  }
}
