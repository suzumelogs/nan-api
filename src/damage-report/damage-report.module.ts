import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { DamageReportController } from './damage-report.controller';
import { DamageReportService } from './damage-report.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DamageReportController],
  providers: [DamageReportService, PrismaService],
})
export class DamageReportModule {}
