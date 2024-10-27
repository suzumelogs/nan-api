import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DiscountService } from './discount.service';

@Injectable()
export class DiscountCronService {
  constructor(private readonly discountService: DiscountService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDiscountChecks() {
    await this.discountService.disableExpiredDiscounts();
    await this.discountService.notifyAdminIfDiscountNearUsageLimit();
  }
}
