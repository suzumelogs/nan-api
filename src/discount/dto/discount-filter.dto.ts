import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class DiscountFilterDto {
  @ApiProperty({ description: 'Mã giảm giá', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Tỉ lệ giảm giá', required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  discountRate?: number;

  @ApiProperty({ description: 'Ngày bắt đầu hiệu lực', required: false })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiProperty({ description: 'Ngày kết thúc hiệu lực', required: false })
  @IsOptional()
  @IsDateString()
  validTo?: string;

  @ApiProperty({
    description: 'Số lần tối đa có thể sử dụng',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxUsage?: number;

  @ApiProperty({
    description: 'Số lần đã sử dụng',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  currentUsage?: number;

  @ApiProperty({
    description: 'Số trang',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Số lượng mỗi trang',
    required: false,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
