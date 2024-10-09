import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePolicyDto {
  @ApiProperty({
    description: 'Mô tả chính sách',
    example: 'Chính sách cho thuê thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Tỷ lệ đặt cọc',
    example: 0.1,
  })
  @IsNotEmpty()
  @IsNumber()
  depositRate: number;

  @ApiProperty({
    description: 'Phí xử lý hỏng hóc',
    example: 50.0,
  })
  @IsNotEmpty()
  @IsNumber()
  damageProcessingFee: number;
}
