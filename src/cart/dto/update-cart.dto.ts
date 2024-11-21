import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    description: 'ID của mục giỏ hàng cần cập nhật',
  })
  @IsNotEmpty()
  cartItemId: string;

  @ApiProperty({
    description: 'Số lượng mới',
  })
  @IsPositive()
  newQuantity: number;
}
