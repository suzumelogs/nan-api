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
    description: 'Hình ảnh của thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Mô tả',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Giá theo ngày',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerDay: number;

  @ApiProperty({
    description: 'Giá theo tuần',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerWeek: number;

  @ApiProperty({
    description: 'Giá theo tháng',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerMonth: number;

  @ApiProperty({
    description: 'Số lượng tồn kho',
  })
  @IsOptional()
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
