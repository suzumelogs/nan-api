import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UserFilterDto {
  @ApiProperty({ description: 'Tên người dùng', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Email người dùng', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Vai trò người dùng', required: false })
  @IsOptional()
  @IsEnum(['user', 'admin'])
  role?: string;

  @ApiProperty({
    description: 'Số trang',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Số lượng mỗi trang',
    required: false,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  limit?: number = 10;
}
