import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID của người dùng',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
