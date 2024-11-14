import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveDeviceFromCartDto {
  @ApiProperty({
    description: 'ID của thiết bị ',
  })
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
