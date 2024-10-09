import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Nội dung của thông báo',
    example: 'Bạn có thông báo mới!',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Trạng thái của thông báo',
    example: 'unread',
  })
  @IsNotEmpty()
  @IsEnum(NotificationStatus)
  status: NotificationStatus;

  @ApiProperty({
    description: 'ID của người dùng nhận thông báo',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
