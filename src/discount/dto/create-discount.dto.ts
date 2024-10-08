import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
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
    description: 'Discount percentage value',
    example: 20.0,
  })
  @IsNotEmpty()
  @IsNumber()
  discountPercentage: number;

  @ApiProperty({
    description: 'Discount start time',
    example: '2024-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @ApiProperty({
    description: 'Discount end time',
    example: '2024-08-31T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @ApiProperty({
    description: 'Limit on the number of uses for the discount code',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxUses: number;
}
