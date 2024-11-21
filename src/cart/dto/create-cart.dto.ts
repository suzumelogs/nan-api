import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID của thiết bị (nếu có)',
    required: false,
  })
  @IsOptional()
  deviceId?: string;

  @ApiProperty({
    description: 'ID của gói (nếu có)',
    required: false,
  })
  @IsOptional()
  packageId?: string;

  @ApiProperty({
    description: 'Số lượng',
  })
  @IsPositive()
  quantity: number;
}
