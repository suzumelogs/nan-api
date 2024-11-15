import { IsArray, IsNumber, IsString } from 'class-validator';

export class CheckoutDto {
  @IsString()
  userId: string;

  @IsArray()
  items: {
    deviceId?: string;
    packageId?: string;
    rentalStartDate: string;
    rentalEndDate: string;
    quantity: number;
  }[];

  @IsNumber()
  depositAmount: number;

  @IsNumber()
  totalPrice: number;
}
