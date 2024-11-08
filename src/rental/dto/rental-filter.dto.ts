import { ApiProperty } from '@nestjs/swagger';
import { RentalStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RentalFilterDto {
  @ApiProperty({ description: 'Trạng thái thuê', required: false })
  @IsOptional()
  @IsEnum(RentalStatus)
  @Type(() => String)
  status?: RentalStatus;

  @ApiProperty({ description: 'ID người thuê', required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  userId?: string;

  @ApiProperty({ description: 'ID thiết bị', required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  deviceId?: string;

  @ApiProperty({ description: 'Ngày bắt đầu thuê', required: false })
  @IsOptional()
  @Type(() => Date)
  rentalStartDate?: Date;

  @ApiProperty({ description: 'Ngày kết thúc thuê', required: false })
  @IsOptional()
  @Type(() => Date)
  rentalEndDate?: Date;

  @ApiProperty({
    description: 'Số trang',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Số lượng mỗi trang',
    required: false,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
