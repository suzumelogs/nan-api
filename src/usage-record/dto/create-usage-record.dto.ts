import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateUsageRecordDto {
  @ApiProperty({
    description: 'ID thiết bị',
  })
  @IsNotEmpty()
  @IsString()
  equipmentId: string;

  @ApiProperty({
    description: 'ID hợp đồng cho thuê (nếu có)',
    required: false,
  })
  @IsOptional()
  @IsString()
  rentalId?: string;

  @ApiProperty({
    description: 'Ngày cho thuê',
  })
  @IsNotEmpty()
  @IsDateString()
  rentalDate: string;

  @ApiProperty({
    description: 'Ngày trả thiết bị (nếu có)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiProperty({
    description: 'Thời gian sử dụng thiết bị (số phút)',
  })
  @IsNotEmpty()
  @IsNumber()
  usageDuration: number;

  @ApiProperty({
    description: 'Các sự cố xảy ra trong quá trình sử dụng',
    required: false,
  })
  @IsOptional()
  @IsString()
  incidents?: string;
}
