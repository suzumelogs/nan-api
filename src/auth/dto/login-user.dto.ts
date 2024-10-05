import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email',
    nullable: false,
    required: true,
    type: 'string',
    example: 'admin@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User Password',
    nullable: false,
    required: true,
    type: 'string',
    example: 'admin@123',
  })
  @IsString()
  password: string;
}
