import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUpcomingDiscountEmail(
    to: string,
    discountCode: string,
    validFrom: Date,
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Thông báo mã giảm giá sắp tới!',
        template: './upcoming-discount',
        context: {
          discountCode,
          validFrom,
        },
      });
    } catch (error) {
      console.error('Gửi email thất bại:', error);
      throw new Error('Gửi email thất bại');
    }
  }
}
