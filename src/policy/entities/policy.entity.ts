import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class Policy {
  @ApiProperty({
    description: 'Mã ID',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

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

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    example: '2024-01-10T00:00:00.000Z',
  })
  updatedAt: Date;
}
