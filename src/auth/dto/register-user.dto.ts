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
    example: 'John Sample',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Email người dùng',
    uniqueItems: true,
    example: 'youremail@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Mật khẩu: Tối thiểu 6 ký tự, 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 số',
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số',
  })
  @NotContains(' ', { message: 'Mật khẩu không được chứa khoảng trắng' })
  password: string;

  @ApiProperty({
    description: 'Xác nhận mật khẩu, phải giống với mật khẩu',
    example: 'Password123',
  })
  @IsString()
  passwordconf: string;
}
