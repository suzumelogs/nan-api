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
import { Notification, NotificationStatus, Role, User } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả thông báo (Không phân trang)',
  })
  findAll(
    @Query('status') status?: NotificationStatus,
  ): Promise<{ data: Notification[] }> {
    return this.notificationService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông báo theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Notification }> {
    return this.notificationService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo một thông báo mới',
  })
  create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.notificationService.create(createNotificationDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thông báo theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa thông báo theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.notificationService.remove(id);
  }

  @Get('get/by-me')
  @ApiOperation({
    summary: 'Lấy thông báo của tôi',
  })
  @Auth(Role.user, Role.super_admin, Role.admin)
  findByUserId(
    @GetUser() user: User,
    @Query('status') status?: NotificationStatus,
  ): Promise<{ data: Notification[] }> {
    return this.notificationService.findAllByUserId(user.id, status);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Đánh dấu thông báo là đã đọc',
  })
  markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.markAsRead(id);
  }

  @Patch('by-me/read')
  @ApiOperation({
    summary: 'Đánh dấu tất cả thông báo của tôi là đã đọc',
  })
  @Auth(Role.user)
  markAllAsReadByUserId(@GetUser() user: User): Promise<{ count: number }> {
    return this.notificationService.markAllAsReadByUserId(user.id);
  }

  @Post('send')
  @ApiOperation({
    summary: 'Gửi thông báo cho người dùng',
  })
  sendNotification(
    @Body() { message, userId }: { message: string; userId: string },
  ): Promise<Notification> {
    return this.notificationService.sendNotification({ message, userId });
  }

  @Post('send-bulk')
  @ApiOperation({
    summary: 'Gửi thông báo cho nhiều người dùng',
  })
  sendBulkNotification(
    @Body() { message, userIds }: { message: string; userIds: string[] },
  ): Promise<Notification[]> {
    return this.notificationService.sendBulkNotification({ message, userIds });
  }

  @Get('unread')
  @ApiOperation({
    summary: 'Lấy thông báo chưa đọc của tôi',
  })
  @Auth(Role.user)
  findUnreadByUserId(@GetUser() user: User): Promise<{ data: Notification[] }> {
    return this.notificationService.findUnreadByUserId(user.id);
  }

  @Delete('cleanup-old')
  @ApiOperation({
    summary: 'Xóa thông báo cũ hơn 30 ngày',
  })
  cleanupOldNotifications(): Promise<{ message: string }> {
    return this.notificationService.cleanupOldNotifications();
  }

  @Get('count')
  @ApiOperation({
    summary: 'Đếm số lượng thông báo của tôi',
  })
  @Auth(Role.user)
  countNotificationsByUserId(@GetUser() user: User): Promise<number> {
    return this.notificationService.countNotificationsByUserId(user.id);
  }
}
