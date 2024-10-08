import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2024-09-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  updatedAt?: string;
}
