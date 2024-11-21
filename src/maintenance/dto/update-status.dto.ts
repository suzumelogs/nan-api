import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceStatus } from '@prisma/client'; // import enum MaintenanceStatus
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'ID của bảo trì cần cập nhật',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Trạng thái bảo trì',
    enum: MaintenanceStatus,
  })
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;

  @ApiProperty({
    description: 'Chi phí bảo trì',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maintenanceCost?: number;
}
