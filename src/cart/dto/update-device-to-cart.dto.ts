import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDeviceToCartDto {
  @IsArray()
  devices: string[];
}
