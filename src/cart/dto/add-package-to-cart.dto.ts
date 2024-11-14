import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPackageToCartDto {
  @ApiProperty({
    description: 'ID của gói thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  packageId: string;

  @ApiProperty({
    description: 'Số lượng gói thiết bị',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
