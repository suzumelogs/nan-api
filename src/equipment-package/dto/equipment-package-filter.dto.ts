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

  @ApiProperty({ description: 'Giá gốc', required: false })
  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @ApiProperty({ description: 'Giá thuê', required: false })
  @IsOptional()
  @IsNumber()
  rentalPrice?: number;

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
