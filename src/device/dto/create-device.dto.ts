import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Daily rental price of the device',
    example: 50.0,
  })
  @IsNotEmpty()
  @IsNumber()
  dailyPrice: number;

  @ApiProperty({
    description: 'Weekly rental price of the device',
    example: 300.0,
  })
  @IsNotEmpty()
  @IsNumber()
  weeklyPrice: number;

  @ApiProperty({
    description: 'Monthly rental price of the device',
    example: 1200.0,
  })
  @IsNotEmpty()
  @IsNumber()
  monthlyPrice: number;

  @ApiProperty({
    description: 'Deposit rate as a percentage of the device’s value',
    example: 0.2,
  })
  @IsNotEmpty()
  @IsNumber()
  depositRate: number;

  @ApiProperty({
    description: 'Original value of the device',
    example: 2000.0,
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Current status of the device',
    enum: DeviceStatus,
    example: DeviceStatus.available,
  })
  @IsNotEmpty()
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}
