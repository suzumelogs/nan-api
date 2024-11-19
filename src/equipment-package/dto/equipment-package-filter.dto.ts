import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class EquipmentPackageFilterDto {
  @ApiProperty({ description: 'Tên gói thiết bị', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Giá theo ngày', required: false })
  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @ApiProperty({ description: 'Giá theo tuần', required: false })
  @IsOptional()
  @IsNumber()
  pricePerWeek?: number;

  @ApiProperty({ description: 'Giá theo tháng', required: false })
  @IsOptional()
  @IsNumber()
  pricePerMonth?: number;

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
