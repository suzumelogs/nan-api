import { ApiProperty } from '@nestjs/swagger';
import { DamageReportStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatus {
  @ApiProperty({
    description: 'ID thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Trạng thái báo hỏng',
  })
  @IsNotEmpty()
  @IsEnum(DamageReportStatus)
  status: DamageReportStatus;
}
