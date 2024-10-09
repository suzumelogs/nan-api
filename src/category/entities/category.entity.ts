import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Category {
  @ApiProperty({
    description: 'Mã ID',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Tên của thể loại (ví dụ: Loa, Đài, Quạt)',
    example: 'Loa',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả của thể loại (tùy chọn)',
    example: 'Thể loại thiết bị âm thanh',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

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
