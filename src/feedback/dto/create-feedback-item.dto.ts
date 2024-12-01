import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateFeedbackItemDto {
  @ApiProperty({
    description: 'Mã ID thiết bị hoặc gói thuê',
  })
  @IsNotEmpty()
  @IsString()
  rentalItemId: string;

  @ApiProperty({
    description: 'Đánh giá từ 1 đến 5',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Nhận xét của người dùng (tùy chọn)',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Mã ID người dùng',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
