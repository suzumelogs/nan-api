import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '@prisma/client';

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
    description: 'Description of the device',
    example: 'A high-quality DSLR camera for professional photography.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image URL of the device',
    example: 'https://example.com/image.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Daily rental price of the device',
    example: 50.0,
  })
  priceDay: number;

  @ApiProperty({
    description: 'Weekly rental price of the device',
    example: 300.0,
  })
  priceWeek: number;

  @ApiProperty({
    description: 'Monthly rental price of the device',
    example: 1000.0,
  })
  priceMonth: number;

  @ApiProperty({
    description: 'Current status of the device',
    enum: DeviceStatus,
    example: DeviceStatus.available,
  })
  status: DeviceStatus;

  @ApiProperty({
    description: 'Category ID to which the device belongs',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Cart ID if the device is added to a cart',
    example: '60b9c3f3b236d17a10b76e6f',
    required: false,
  })
  cartId: string;

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
