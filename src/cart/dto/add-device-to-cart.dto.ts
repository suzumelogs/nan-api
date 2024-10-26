import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddDeviceToCartDto {
  @ApiProperty({
    description: 'The ID of the device to add to the cart',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description: 'Rental duration in days',
    type: Number,
    example: 7,
  })
  @IsNumber()
  rentalDuration: number;
}
