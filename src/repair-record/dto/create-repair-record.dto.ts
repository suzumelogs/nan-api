import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateRepairRecordDto {
  @ApiProperty({
    description: 'ID thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  equipmentId: string;

  @ApiProperty({
    description: 'Ngày sửa chữa',
  })
  @IsNotEmpty()
  @IsDateString()
  repairDate: string;

  @ApiProperty({
    description: 'Nguyên nhân hư hỏng',
  })
  @IsNotEmpty()
  @IsString()
  failureCause: string;

  @ApiProperty({
    description: 'Các bộ phận đã thay thế',
    required: false,
  })
  @IsOptional()
  @IsString()
  partsReplaced?: string;

  @ApiProperty({
    description: 'Chi phí sửa chữa',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  repairCost?: number;

  @ApiProperty({
    description: 'Ngày bảo hành',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  warranty?: string;
}
