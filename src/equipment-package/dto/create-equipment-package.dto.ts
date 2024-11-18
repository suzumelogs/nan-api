import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEquipmentPackageDto {
  @ApiProperty({
    description: 'Tên gói thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả gói thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Giá theo ngày',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerDay?: number;

  @ApiProperty({
    description: 'Giá theo tuần',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerWeek?: number;

  @ApiProperty({
    description: 'Giá theo tháng',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerMonth?: number;
}
