import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateDeviceDto } from './create-device.dto';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
  @ApiProperty({
    description: 'Timestamp when the device was last updated',
    example: '2024-09-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  updatedAt?: string;
}
