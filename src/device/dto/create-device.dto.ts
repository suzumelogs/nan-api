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
    description: 'Name of the device',
    example: 'Canon EOS 90D DSLR Camera',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Image URL of the device',
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Description of the device',
    example: 'A high-quality DSLR camera for professional photography.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Daily rental price of the device',
    example: 50.0,
  })
  @IsNotEmpty()
  @IsNumber()
  priceDay: number;

  @ApiProperty({
    description: 'Weekly rental price of the device',
    example: 300.0,
  })
  @IsNotEmpty()
  @IsNumber()
  priceWeek: number;

  @ApiProperty({
    description: 'Monthly rental price of the device',
    example: 1000.0,
  })
  @IsNotEmpty()
  @IsNumber()
  priceMonth: number;

  @ApiProperty({
    description: 'Current status of the device',
    enum: DeviceStatus,
    example: DeviceStatus.available,
  })
  @IsNotEmpty()
  @IsEnum(DeviceStatus)
  status: DeviceStatus;

  @ApiProperty({
    description: 'Category ID to which the device belongs',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    description: 'Cart ID if the device is added to a cart',
    example: '60b9c3f3b236d17a10b76e6f',
    required: false,
  })
  @IsOptional()
  @IsString()
  cartId?: string;
}
