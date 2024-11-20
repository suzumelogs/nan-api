import { ApiProperty } from '@nestjs/swagger';
import { RentalStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RentalFilterDto {
  @ApiProperty({
    description: 'ID người dùng',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Trạng thái đơn thuê',
    required: false,
    enum: RentalStatus,
  })
  @IsOptional()
  @IsEnum(RentalStatus)
  status?: RentalStatus;

  @ApiProperty({
    description: 'Ngày bắt đầu',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Ngày kết thúc',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Số tiền tổng',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

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
