import { Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationCronService {
  constructor(private readonly notificationService: NotificationService) {}

  async handleCleanupOldNotifications() {
    console.log('Công việc Cron đang chạy: Đang dọn dẹp các thông báo cũ...');
    await this.notificationService.cleanupOldNotifications();
    console.log('Dọn dẹp các thông báo cũ đã hoàn thành.');
  }

  // @Cron(CronExpression.EVERY_5_MINUTES)
  // async handleSendNotification() {
  //   console.log(
  //     'Cron job running: Sending random notification to all users...',
  //   );

  //   await this.notificationService.sendRandomNotificationToAllUsers();

  //   console.log('Random notification sent to all users.');
  // }
}
