import { ApiProperty } from '@nestjs/swagger';

export class Discount {
  @ApiProperty({
    description: 'Unique identifier for the discount',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Unique discount code',
    example: 'SUMMER2024',
  })
  code: string;

  @ApiProperty({
    description: 'Discount percentage',
    example: 20.0,
  })
  discountPercentage: number;

  @ApiProperty({
    description: 'Discount start time',
    example: '2024-06-01T00:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Discount end time',
    example: '2024-08-31T00:00:00.000Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'Maximum number of uses for the discount code',
    example: 100,
    required: false,
  })
  maxUses?: number;

  @ApiProperty({
    description: 'Timestamp when the discount was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the discount was last updated',
    example: '2024-01-10T00:00:00.000Z',
  })
  updatedAt: Date;
}
