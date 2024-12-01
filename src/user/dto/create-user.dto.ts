import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

export class CreateUserDto extends RegisterUserDto {
  @ApiProperty({
    description: 'Vai trò người dùng (admin, user)',
  })
  @IsString()
  @IsOptional()
  role?: Role;
}
