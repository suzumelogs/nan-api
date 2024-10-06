import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDiscountDto } from './create-discount.dto';
import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {
  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2024-09-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  updatedAt?: string;
}
