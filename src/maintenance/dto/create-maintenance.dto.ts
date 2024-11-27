import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMaintenanceDto {
  @ApiProperty({
    description: 'Ngày bảo trì',
  })
  @IsNotEmpty()
  maintenanceDate: Date;

  @ApiProperty({
    description: 'Mô tả về bảo trì (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Đề xuất lần bảo trì tiếp theo (tùy chọn)',
    required: false,
  })
  @IsOptional()
  suggestedNextMaintenance?: Date;

  @ApiProperty({
    description: 'Trạng thái bảo trì',
  })
  @IsNotEmpty()
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;

  @ApiProperty({
    description: 'Chi phí bảo trì (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maintenanceCost?: number;

  @ApiProperty({
    description: 'ID thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  equipmentId: string;
}
