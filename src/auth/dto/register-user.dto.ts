import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Tên người dùng',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Email người dùng',
    uniqueItems: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Xác nhận mật khẩu, phải giống với mật khẩu',
  })
  @IsString()
  passwordconf: string;
}
