import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
} from 'class-validator';

export class Maintenance {
  @ApiProperty({
    description: 'Mã ID',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Ngày bảo trì',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  maintenanceDate: Date;

  @ApiProperty({
    description: 'Mô tả về bảo trì (tùy chọn)',
    example: 'Thực hiện bảo trì định kỳ cho thiết bị.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Đề xuất lần bảo trì tiếp theo (tùy chọn)',
    example: '2024-06-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  suggestedNextMaintenance?: Date;

  @ApiProperty({
    description: 'Trạng thái bảo trì',
    example: 'pending',
  })
  @IsNotEmpty()
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;

  @ApiProperty({
    description: 'ID thiết bị',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    example: '2024-01-10T00:00:00.000Z',
  })
  updatedAt: Date;
}
