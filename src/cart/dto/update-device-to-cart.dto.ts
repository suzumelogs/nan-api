import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceToCartDto {
  @ApiProperty({
    description: 'The rental duration in days (optional)',
    type: Number,
    example: 14,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rentalDuration?: number;

  @ApiProperty({
    description: 'The total price calculated (optional)',
    type: Number,
    example: 100.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;
}
