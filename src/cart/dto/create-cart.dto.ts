import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
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
}
