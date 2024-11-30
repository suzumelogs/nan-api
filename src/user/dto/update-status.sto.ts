import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IdentityDocStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Trạng thái chứng minh thư',
    enum: IdentityDocStatus,
  })
  @IsEnum(IdentityDocStatus)
  statusIdentityDoc: IdentityDocStatus;
}
