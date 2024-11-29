import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { DamageReportController } from './damage-report.controller';
import { DamageReportService } from './damage-report.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DamageReportController],
  providers: [DamageReportService, PrismaService, NotificationService],
})
export class DamageReportModule {}
