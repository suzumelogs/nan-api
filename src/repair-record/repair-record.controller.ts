import { Controller } from '@nestjs/common';
import { RepairRecordService } from './repair-record.service';

@Controller('repair-record')
export class RepairRecordController {
  constructor(private readonly repairRecordService: RepairRecordService) {}
}
