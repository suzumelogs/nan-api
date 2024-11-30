import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class RepairRecordFilterDto {
  @ApiProperty({ description: 'ID thiết bị', required: false })
  @IsOptional()
  @IsString()
  equipmentId?: string;

  @ApiProperty({ description: 'Ngày sửa chữa', required: false })
  @IsOptional()
  @IsDateString()
  repairDate?: string;

  @ApiProperty({ description: 'Nguyên nhân hư hỏng', required: false })
  @IsOptional()
  @IsString()
  failureCause?: string;

  @ApiProperty({ description: 'Chi phí sửa chữa', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  repairCost?: number;

  @ApiProperty({ description: 'Ngày bảo hành', required: false })
  @IsOptional()
  @IsDateString()
  warranty?: string;

  @ApiProperty({
    description: 'Số trang',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Số lượng mỗi trang',
    required: false,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
