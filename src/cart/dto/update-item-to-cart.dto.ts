import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItemToCartDto } from './create-item-to-cart.dto';
import { IsString } from 'class-validator';

export class UpdateItemToCartDto extends PartialType(CreateItemToCartDto) {
  @ApiProperty({
    description: 'ID của mục trong giỏ hàng cần được cập nhật',
    type: String,
    required: true,
  })
  @IsString()
  cartItemId: string;
}
