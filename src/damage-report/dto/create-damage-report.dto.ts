import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDamageReportDto {
  @ApiProperty({
    description: 'Mô tả thiết bị hỏng',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Mô tả thiết bị hỏng',
  })
  @IsString()
  image: string;

  @ApiProperty({
    description: 'ID thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  equipmentId: string;
}
