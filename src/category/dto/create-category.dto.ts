import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category (e.g., Loa, Đài, Quạt)',
    example: 'Loa',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
