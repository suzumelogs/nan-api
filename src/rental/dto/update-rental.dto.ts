import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateRentalDto } from './create-rental.dto';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {
  @IsOptional()
  @IsString()
  updatedAt: string;
}
