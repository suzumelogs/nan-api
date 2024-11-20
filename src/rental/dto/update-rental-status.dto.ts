import { RentalStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateRentalStatusDto {
  @IsEnum(RentalStatus)
  status: RentalStatus;
}
