import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateFeedbackDto } from './create-feedback.dto';

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
  @IsOptional()
  @IsString()
  updatedAt: string;
}
