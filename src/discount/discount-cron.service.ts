import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DiscountService } from './discount.service';

@Injectable()
export class DiscountCronService {
  constructor(private readonly discountService: DiscountService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDiscountChecks() {
    console.log('Công việc Cron đang chạy: Kiểm tra các giảm giá...');
    await this.discountService.disableExpiredDiscounts();
    console.log('Đã tắt các giảm giá đã hết hạn.');

    await this.discountService.notifyAdminIfDiscountNearUsageLimit();
    console.log(
      'Đã thông báo cho quản trị viên nếu giảm giá gần hết giới hạn sử dụng.',
    );

    await this.discountService.notifyUsersAboutUpcomingDiscounts();
    console.log('Đã thông báo cho người dùng về các giảm giá sắp tới.');
  }
}
