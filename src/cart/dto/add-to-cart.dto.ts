import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID của thiết bị',
  })
  @IsString()
  @IsOptional()
  equipmentId?: string;

  @ApiProperty({
    description: 'ID của gói thiết bị',
  })
  @IsString()
  @IsOptional()
  packageId?: string;

  @ApiProperty({
    description: 'Số lượng',
    example: 1,
    type: Number,
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'Giá cho thuê của sản phẩm hoặc gói sản phẩm',
    example: 100,
    type: Number,
  })
  @IsNumber()
  price: number;
}
