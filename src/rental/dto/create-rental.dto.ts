import { ApiProperty } from '@nestjs/swagger';
import { Duration } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

class RentalItemDto {
  @ApiProperty({
    description: 'ID của thiết bị được thuê',
    required: false,
    type: String,
  })
  @IsString()
  equipmentId?: string;

  @ApiProperty({
    description: 'ID của gói thiết bị được thuê',
    required: false,
    type: String,
  })
  @IsString()
  packageId?: string;

  @ApiProperty({
    description: 'Số lượng thiết bị thuê',
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Loại đơn vị thời gian thuê (Ngày, Tuần, Tháng)',
    enum: Duration,
  })
  @IsEnum(Duration)
  durationType: Duration;

  @ApiProperty({
    description: 'Giá trị của thời gian thuê (ví dụ: số ngày, tuần, tháng)',
  })
  @IsInt()
  @Min(1)
  durationValue: number;

  @ApiProperty({
    description: 'Giá thuê của thiết bị hoặc gói thiết bị',
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateRentalDto {
  @ApiProperty({
    description: 'Ngày bắt đầu thuê',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Ngày kết thúc thuê',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Danh sách các mục thuê',
    type: [RentalItemDto],
  })
  @IsArray()
  items: RentalItemDto[];

  @ApiProperty({
    description: 'Tổng số tiền thuê',
  })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'Địa chỉ',
    type: String,
  })
  @IsString()
  address: string;
}
