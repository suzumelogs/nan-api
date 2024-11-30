import { IsOptional, IsString, IsInt, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
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
  @IsInt()
  phoneNumber?: number;

  @ApiProperty({
    description: 'Ngày sinh',
  })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

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
