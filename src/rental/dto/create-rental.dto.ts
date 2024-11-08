import { ApiProperty } from '@nestjs/swagger';
import { RentalStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateRentalDto {
  @ApiProperty({
    description: 'Ngày bắt đầu thuê',
    example: '2024-01-01T10:00:00.000Z',
  })
  @IsNotEmpty()
  rentalStartDate: Date;

  @ApiProperty({
    description: 'Ngày kết thúc thuê',
    example: '2024-01-10T10:00:00.000Z',
  })
  @IsNotEmpty()
  rentalEndDate: Date;

  @ApiProperty({
    description: 'Tổng giá thuê',
    example: 100.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @ApiProperty({
    description: 'Số tiền đặt cọc',
    example: 20.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  depositAmount: number;

  @ApiProperty({
    description: 'Phí hỏng hóc nếu có',
    example: 10.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  damageFee?: number;

  @ApiProperty({
    description: 'Trạng thái của giao dịch thuê',
    enum: RentalStatus,
    example: RentalStatus.pending,
  })
  @IsNotEmpty()
  status: RentalStatus;

  @ApiProperty({
    description: 'ID người dùng',
    example: '60b9c3f3b236d17a10b76e6a',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID thiết bị',
    example: '60b9c3f3b236d17a10b76e6b',
  })
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
