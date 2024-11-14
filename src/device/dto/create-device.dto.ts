import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Tên thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL hình ảnh',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Mô tả thiết bị',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Giá thuê hàng ngày',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceDay?: number;

  @ApiProperty({
    description: 'Giá thuê hàng tuần',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceWeek?: number;

  @ApiProperty({
    description: 'Giá thuê hàng tháng',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  priceMonth?: number;

  @ApiProperty({
    description: 'Trạng thái thiết bị',
    enum: DeviceStatus,
    default: DeviceStatus.available,
  })
  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  @ApiProperty({
    description: 'ID danh mục',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    description: 'Số lượng thiết bị',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiProperty({
    description: 'ID gói dịch vụ (nếu có)',
  })
  @IsOptional()
  @IsString()
  packageId?: string;

  @ApiProperty({
    description: 'ID giỏ hàng (nếu có)',
  })
  @IsOptional()
  @IsString()
  cartId?: string;
}
