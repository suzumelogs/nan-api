import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateDeviceToCartDto {
  @ApiProperty({
    description: 'Thời gian thuê tính theo ngày (optinal)',
    type: Number,
    example: 14,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rentalDuration?: number;

  @ApiProperty({
    description: 'Tổng giá tính toán (optional)',
    type: Number,
    example: 100.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;
}
