import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateItemToCartDto {
  @ApiProperty({
    description: 'ID của item',
  })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @ApiProperty({
    description: 'Số lượng',
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
