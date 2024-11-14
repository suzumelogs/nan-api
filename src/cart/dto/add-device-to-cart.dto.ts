import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddDeviceToCartDto {
  @ApiProperty({
    description: 'ID của thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty({
    description: 'Số lượng thiết bị',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
