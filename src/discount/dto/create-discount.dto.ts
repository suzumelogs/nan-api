import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
    description: 'Discount rate in percentage',
    example: 20.0,
  })
  @IsNotEmpty()
  @IsNumber()
  discountRate: number;

  @ApiProperty({
    description: 'Discount start time',
    example: '2024-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  validFrom: Date;

  @ApiProperty({
    description: 'Discount end time',
    example: '2024-08-31T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  validTo: Date;

  @ApiProperty({
    description: 'Limit on the number of uses for the discount code',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxUsage: number;
}
