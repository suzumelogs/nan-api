import { PartialType } from '@nestjs/swagger';
import { CreateUsageRecordDto } from './create-usage-record.dto';

export class UpdateUsageRecordDto extends PartialType(CreateUsageRecordDto) {}
