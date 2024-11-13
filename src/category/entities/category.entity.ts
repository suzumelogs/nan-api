import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Category {
  @ApiProperty({
    description: 'Mã ID',
  })
  id: string;

  @ApiProperty({
    description: 'Tên danh mục',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

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
