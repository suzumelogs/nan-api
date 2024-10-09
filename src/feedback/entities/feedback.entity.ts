import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
} from 'class-validator';

export class Feedback {
  @ApiProperty({
    description: 'Mã ID',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Đánh giá từ 1 đến 5',
    example: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Nhận xét của người dùng (tùy chọn)',
    example: 'Sản phẩm rất tốt!',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Phản hồi từ admin (tùy chọn)',
    example: 'Cảm ơn bạn đã phản hồi!',
    required: false,
  })
  @IsOptional()
  @IsString()
  adminResponse?: string;

  @ApiProperty({
    description: 'ID của người dùng để phản hồi',
    example: '60b9c3f3b236d17a10b76e70',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID của giao dịch thuê',
    example: '60b9c3f3b236d17a10b76e80',
  })
  @IsNotEmpty()
  @IsString()
  rentalId: string;

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
