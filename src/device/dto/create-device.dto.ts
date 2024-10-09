import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Tên thiết bị',
    example: 'Canon EOS 90D DSLR Camera',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL hình ảnh',
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Mô tả thiết bị',
    example: 'Máy ảnh DSLR chất lượng cao.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Giá thuê hàng ngày',
    example: 50.0,
  })
  @IsNotEmpty()
  @IsNumber()
  priceDay: number;

  @ApiProperty({
    description: 'Giá thuê hàng tuần',
    example: 300.0,
  })
  @IsNotEmpty()
  @IsNumber()
  priceWeek: number;

  @ApiProperty({
    description: 'Giá thuê hàng tháng',
    example: 1000.0,
  })
  @IsNotEmpty()
  @IsNumber()
  priceMonth: number;

  @ApiProperty({
    description: 'Trạng thái thiết bị',
    enum: DeviceStatus,
    example: DeviceStatus.available,
  })
  @IsNotEmpty()
  @IsEnum(DeviceStatus)
  status: DeviceStatus;

  @ApiProperty({
    description: 'ID danh mục',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    description: 'ID giỏ hàng (nếu có)',
    example: '60b9c3f3b236d17a10b76e6f',
    required: false,
  })
  @IsOptional()
  @IsString()
  cartId?: string;
}
