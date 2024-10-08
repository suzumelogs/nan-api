import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus, Device as PrismaDevice } from '@prisma/client';

export class Device {
  @ApiProperty({
    description: 'Unique identifier for the device',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the device',
    example: 'Canon EOS 90D DSLR Camera',
  })
  name: string;

  @ApiProperty({
    description: 'Image URL of the device',
    example: 'https://example.com/image.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Description of the device',
    example: 'A high-quality DSLR camera for professional photography.',
  })
  description: string;

  @ApiProperty({
    description: 'Daily rental price of the device',
    example: 50.0,
  })
  dailyPrice: number;

  @ApiProperty({
    description: 'Weekly rental price of the device',
    example: 300.0,
  })
  weeklyPrice: number;

  @ApiProperty({
    description: 'Monthly rental price of the device',
    example: 1200.0,
  })
  monthlyPrice: number;

  @ApiProperty({
    description: 'Deposit rate as a percentage of the device’s value',
    example: 0.2,
  })
  depositRate: number;

  @ApiProperty({
    description: 'Original value of the device',
    example: 2000.0,
  })
  value: number;

  @ApiProperty({
    description: 'Current status of the device',
    enum: DeviceStatus,
    example: DeviceStatus.available,
  })
  status: DeviceStatus;

  @ApiProperty({
    description: 'Timestamp when the device was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the device was last updated',
    example: '2024-01-10T00:00:00.000Z',
  })
  updatedAt: Date;
}
