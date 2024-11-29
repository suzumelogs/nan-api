import { ApiProperty } from '@nestjs/swagger';
import { DamageReportStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatus {
  @ApiProperty({
    description: 'Trạng thái báo hỏng',
  })
  @IsNotEmpty()
  @IsEnum(DamageReportStatus)
  status: DamageReportStatus;
}
