import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemToCartDto {
  @ApiProperty({
    description: 'ID của thiết bị (tùy chọn)',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  equipmentId?: string;

  @ApiProperty({
    description: 'ID của gói thiết bị (tùy chọn)',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  packageId?: string;

  @ApiProperty({
    description: 'Số lượng',
    type: Number,
    required: true,
  })
  @IsNumber()
  quantity: number;
}
