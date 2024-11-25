import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateItemToCartDto {
  @ApiProperty({
    description: 'ID của item',
    type: String,
    required: true,
  })
  @IsString()
  cartItemId: string;

  @ApiProperty({
    description: 'Số lượng mới',
    type: Number,
    required: true,
  })
  @IsNumber()
  newQuantity: number;
}
