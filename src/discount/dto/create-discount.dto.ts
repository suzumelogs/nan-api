import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({
    description: 'Unique discount code',
    example: 'SUMMER2024',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Discount value',
    example: 20.0,
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Discount valid from date',
    example: '2024-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  validFrom: Date;

  @ApiProperty({
    description: 'Discount valid to date',
    example: '2024-08-31T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  validTo: Date;

  @ApiProperty({
    description: 'Limit on the number of uses for the discount code',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
