import { Module } from '@nestjs/common';
import { UsageRecordService } from './usage-record.service';
import { UsageRecordController } from './usage-record.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UsageRecordController],
  providers: [UsageRecordService, PrismaService],
})
export class UsageRecordModule {}
