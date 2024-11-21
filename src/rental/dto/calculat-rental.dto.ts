import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class CalculateRentalDto {
  @ApiProperty({
    description: 'Danh sách ID của các thiết bị cần thuê',
  })
  @IsArray()
  deviceIds: string[];

  @ApiProperty({
    description: 'Ngày bắt đầu thuê',
  })
  @IsDateString()
  rentalStartDate: string;

  @ApiProperty({
    description: 'Ngày kết thúc thuê',
  })
  @IsDateString()
  rentalEndDate: string;

  @ApiProperty({
    description: 'Danh sách ID của các gói thuê (tuỳ chọn)',
  })
  @IsOptional()
  @IsArray()
  packageIds?: string[];
}
