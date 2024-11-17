import { ApiProperty } from '@nestjs/swagger';
import { Duration } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({
    description: 'Loại thời gian thuê',
    enum: Duration,
    required: true,
  })
  @IsEnum(Duration)
  durationType: Duration;

  @ApiProperty({
    description: 'Giá trị thời gian thuê',
    type: Number,
    required: true,
  })
  @IsNumber()
  durationValue: number;

  @ApiProperty({
    description: 'Giá của mục trong giỏ hàng (tùy chọn)',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}
