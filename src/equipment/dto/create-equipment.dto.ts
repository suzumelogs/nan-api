import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({
    description: 'Tên thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Hình ảnh',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Mô tả',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Giá gốc',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  basePrice: number;

  @ApiProperty({
    description: 'Giá thuê',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  rentalPrice: number;

  @ApiProperty({
    description: 'Số lượng',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Mã danh mục',
  })
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;
}
