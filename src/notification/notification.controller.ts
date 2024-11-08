import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
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
  findAll(): Promise<Notification[]> {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông báo theo ID',
  })
  findOne(@Param('id') id: string): Promise<Notification> {
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

  @Get('by-me')
  @ApiOperation({
    summary: 'Lấy thông báo của tôi',
  })
  findByUserId(@GetUser() user: User): Promise<Notification[]> {
    return this.notificationService.findByUserId(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Đánh dấu thông báo là đã đọc',
  })
  markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.markAsRead(id);
  }
}
