import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class EquipmentFilterDto {
  @ApiProperty({ description: 'Tên thiết bị', required: false })
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
  @IsPositive()
  basePrice?: number;

  @ApiProperty({ description: 'Giá thuê', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rentalPrice?: number;

  @ApiProperty({ description: 'Số lượng', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  stock?: number;

  @ApiProperty({ description: 'ID danh mục thiết bị', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

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
