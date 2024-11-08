import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class MaintenanceFilterDto {
  @ApiProperty({ description: 'Ngày bảo trì', required: false })
  @IsOptional()
  @IsDateString()
  maintenanceDate?: string;

  @ApiProperty({ description: 'Mô tả bảo trì', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Đề xuất ngày bảo trì tiếp theo',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  suggestedNextMaintenance?: string;

  @ApiProperty({
    description: 'Trạng thái bảo trì',
    enum: MaintenanceStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @ApiProperty({
    description: 'Chi phí bảo trì',
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maintenanceCost?: number;

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
