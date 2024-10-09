import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class Cart {
  @ApiProperty({
    description: 'Mã ID',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Thời gian thuê (ngày)',
    example: 7,
  })
  @IsNotEmpty()
  @IsNumber()
  rentalDuration: number;

  @ApiProperty({
    description: 'Tổng giá thuê',
    example: 150.5,
  })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'ID của người dùng',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

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
