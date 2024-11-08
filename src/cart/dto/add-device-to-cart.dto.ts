import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddDeviceToCartDto {
  @ApiProperty({
    description: 'ID của thiết bị để thêm vào giỏ hàng',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description: 'Thời gian thuê tính theo ngày',
    type: Number,
    example: 7,
  })
  @IsNumber()
  rentalDuration: number;
}
