import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService, PrismaService, NotificationService],
})
export class DiscountModule {}
