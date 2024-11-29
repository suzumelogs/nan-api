import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddEquipmentsToPackageDto {
  @ApiProperty({ description: 'ID của gói thiết bị' })
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiProperty({ description: 'Mảng ID của thiết bị' })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  equipmentIds: string[];
}
