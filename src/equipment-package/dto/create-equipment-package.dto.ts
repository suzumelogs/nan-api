import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';

export class CreateEquipmentPackageDto {
  @ApiProperty({ description: 'Tên gói thiết bị' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mô tả' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Hình ảnh' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ description: 'Giá gốc', required: false })
  @IsNotEmpty()
  @IsNumber()
  basePrice?: number;

  @ApiProperty({ description: 'Giá thuê', required: false })
  @IsNotEmpty()
  @IsNumber()
  rentalPrice?: number;

  @ApiProperty({
    description: 'Danh sách ID của thiết bị liên quan',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  equipmentIds?: string[];
}
