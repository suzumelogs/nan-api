import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEquipmentPackageDto {
  @ApiProperty({ description: 'Tên gói thiết bị' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mô tả' })
  @IsString()
  @IsNotEmpty()
  description: string;

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

  // @ApiProperty({
  //   description: 'Danh sách ID của thiết bị liên quan',
  //   type: [String],
  //   required: false,
  // })
  // @IsArray()
  // @IsString({ each: true })
  // @IsOptional()
  // equipments?: string[];
}
