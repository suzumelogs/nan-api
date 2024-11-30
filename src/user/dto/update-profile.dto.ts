import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Tên',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Chứng minh thư',
  })
  @IsOptional()
  @IsString()
  identityDoc?: string;

  @ApiProperty({
    description: 'Số điện thoại',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Ngày sinh',
  })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Ảnh đại diện',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Giới tinh',
  })
  @IsOptional()
  @IsString()
  gender?: string;
}
