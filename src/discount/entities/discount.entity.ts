import { ApiProperty } from '@nestjs/swagger';
import { Discount as PrismaDiscount } from '@prisma/client';

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
    description: 'Discount value',
    example: 20.0,
  })
  value: number;

  @ApiProperty({
    description: 'Discount valid from date',
    example: '2024-06-01T00:00:00.000Z',
  })
  validFrom: Date;

  @ApiProperty({
    description: 'Discount valid to date',
    example: '2024-08-31T00:00:00.000Z',
  })
  validTo: Date;

  @ApiProperty({
    description: 'Limit on the number of uses for the discount code',
    example: 100,
    required: false,
  })
  limit?: number;

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
