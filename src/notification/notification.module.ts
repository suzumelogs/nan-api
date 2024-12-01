import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationCronService } from './notification-cron.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService, NotificationCronService],
})
export class NotificationModule {}
