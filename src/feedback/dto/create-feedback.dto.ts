import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
} from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Đánh giá từ 1 đến 5',
    example: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Nhận xét của người dùng (tùy chọn)',
    example: 'Sản phẩm rất tốt!',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Mã ID người dùng',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Mã ID thuê',
    example: '60b9c3f3b236d17a10b76e6g',
  })
  @IsNotEmpty()
  @IsString()
  rentalId: string;
}
