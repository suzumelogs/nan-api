import { Module } from '@nestjs/common';
import { RepairRecordService } from './repair-record.service';
import { RepairRecordController } from './repair-record.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RepairRecordController],
  providers: [RepairRecordService, PrismaService],
})
export class RepairRecordModule {}
