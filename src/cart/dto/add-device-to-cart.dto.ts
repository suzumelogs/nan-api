import { IsNotEmpty, IsString } from 'class-validator';

export class AddDeviceToCartDto {
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
