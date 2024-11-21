import { IsArray } from 'class-validator';

export class CalculateDto {
  @IsArray()
  items: {
    deviceId?: string;
    packageId?: string;
    rentalStartDate: string;
    rentalEndDate: string;
    quantity: number;
  }[];
}
