import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveItemToCartDto {
  @ApiProperty({
    description: 'ID của item',
  })
  @IsNotEmpty()
  @IsString()
  itemId: string;
}
