import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemovePackageFromCartDto {
  @ApiProperty({
    description: 'ID của gói thiết bị ',
  })
  @IsNotEmpty()
  @IsString()
  packageId: string;
}
