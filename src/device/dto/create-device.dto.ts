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
    description: 'Original value of the device',
    example: 2000.0,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Current status of the device',
    enum: DeviceStatus,
    example: DeviceStatus.available,
  })
  @IsNotEmpty()
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}
