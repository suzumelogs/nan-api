import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class UsageRecordFilterDto {
  @ApiProperty({ description: 'ID thiết bị', required: false })
  @IsOptional()
  @IsString()
  equipmentId?: string;

  @ApiProperty({ description: 'Ngày cho thuê', required: false })
  @IsOptional()
  @IsDateString()
  rentalDate?: string;

  @ApiProperty({ description: 'Ngày trả thiết bị', required: false })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiProperty({
    description: 'Thời gian sử dụng (tính bằng phút)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  usageDuration?: number;

  @ApiProperty({
    description: 'Các sự cố xảy ra trong quá trình sử dụng',
    required: false,
  })
  @IsOptional()
  @IsString()
  incidents?: string;

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
