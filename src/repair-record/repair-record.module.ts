import { Module } from '@nestjs/common';
import { RepairRecordService } from './repair-record.service';
import { RepairRecordController } from './repair-record.controller';

@Module({
  controllers: [RepairRecordController],
  providers: [RepairRecordService],
})
export class RepairRecordModule {}
