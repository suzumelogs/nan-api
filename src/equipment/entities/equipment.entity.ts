import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class Equipment {
  @ApiProperty({
    description: 'Mã ID',
  })
  id: string;

  @ApiProperty({
    description: 'Tên thiết bị',
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
    description: 'Giá theo ngày',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerDay: number;

  @ApiProperty({
    description: 'Giá theo tuần',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerWeek: number;

  @ApiProperty({
    description: 'Giá theo tháng',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerMonth: number;

  @ApiProperty({
    description: 'Số lượng tồn kho',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Mã danh mục',
  })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Thời gian tạo',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
  })
  updatedAt: Date;
}
