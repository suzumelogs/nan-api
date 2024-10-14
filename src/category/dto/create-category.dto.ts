import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Loa',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả',
    example: 'Thể loại thiết bị âm thanh',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Giá theo ngày',
    example: 15.99,
  })
  @IsNotEmpty()
  @IsNumber()
  priceDay: number;

  @ApiProperty({
    description: 'Giá theo tuần',
    example: 99.99,
  })
  @IsNotEmpty()
  @IsNumber()
  priceWeek: number;

  @ApiProperty({
    description: 'Giá theo tháng',
    example: 399.99,
  })
  @IsNotEmpty()
  @IsNumber()
  priceMonth: number;
}
