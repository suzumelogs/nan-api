import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({
    description: 'Mã giảm giá',
    example: 'SUMMER2024',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Tỷ lệ giảm giá (%)',
    example: 20.0,
  })
  @IsNotEmpty()
  @IsNumber()
  discountRate: number;

  @ApiProperty({
    description: 'Thời gian bắt đầu',
    example: '2024-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  validFrom: Date;

  @ApiProperty({
    description: 'Thời gian kết thúc',
    example: '2024-08-31T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  validTo: Date;

  @ApiProperty({
    description: 'Giới hạn số lần sử dụng',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxUsage: number;
}
