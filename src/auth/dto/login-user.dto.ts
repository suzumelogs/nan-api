import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email người dùng',
    example: 'admin@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu người dùng',
    example: 'admin@123',
  })
  @IsString()
  password: string;
}
