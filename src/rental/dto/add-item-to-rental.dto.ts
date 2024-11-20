import { ApiProperty } from '@nestjs/swagger';
import { Duration } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class AddItemToRentalDto {
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
  durationValue: number;

  @ApiProperty({
    description: 'Giá thuê của thiết bị hoặc gói thiết bị',
  })
  @IsNumber()
  price: number;
}
