import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus } from '@prisma/client';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class Notification {
  @ApiProperty({
    description: 'Mã ID',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

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

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    example: '2024-01-10T00:00:00.000Z',
  })
  updatedAt: Date;
}
