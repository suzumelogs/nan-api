import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

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
  description: string;

  @ApiProperty({
    description: 'Thời gian tạo',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
  })
  updatedAt: Date;
}
