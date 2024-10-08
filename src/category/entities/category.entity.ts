import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Category {
  @ApiProperty({
    description: 'Unique identifier for the category',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Name of the category (e.g., Loa, Đài, Quạt)',
    example: 'Loa',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Timestamp when the category was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the category was last updated',
    example: '2024-01-10T00:00:00.000Z',
  })
  updatedAt: Date;
}
