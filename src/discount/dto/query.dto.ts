import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class QueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsNumber()
  discountRate?: number;
}
