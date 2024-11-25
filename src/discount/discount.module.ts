import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountCronService } from './discount-cron.service';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [DiscountController],
  providers: [
    DiscountService,
    PrismaService,
    NotificationService,
    DiscountCronService,
  ],
})
export class DiscountModule {}
