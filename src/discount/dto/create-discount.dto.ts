import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({
    description: 'Mã giảm giá',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Tỷ lệ giảm giá (%)',
  })
  @IsNotEmpty()
  @IsNumber()
  discountRate: number;

  @ApiProperty({
    description: 'Thời gian bắt đầu',
  })
  @IsNotEmpty()
  @IsDateString()
  validFrom: Date;

  @ApiProperty({
    description: 'Thời gian kết thúc',
  })
  @IsNotEmpty()
  @IsDateString()
  validTo: Date;

  @ApiProperty({
    description: 'Giới hạn số lần sử dụng',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxUsage: number;

  @ApiProperty({
    description: 'Số lần đã sử dụng',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  currentUsage?: number;

  @ApiProperty({
    description: 'Trạng thái hoạt động của mã giảm giá',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
