import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveItemToCartDto {
  @ApiProperty({
    description: 'ID của item',
    type: String,
    required: true,
  })
  @IsString()
  cartItemId: string;
}
