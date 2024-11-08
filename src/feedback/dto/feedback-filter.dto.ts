import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FeedbackFilterDto {
  @ApiProperty({
    description: 'Đánh giá từ người dùng (1-5)',
    required: false,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: 'Nội dung phản hồi của người dùng',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ description: 'Phản hồi từ admin', required: false })
  @IsOptional()
  @IsString()
  adminResponse?: string;

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
