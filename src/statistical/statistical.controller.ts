import { Controller, Get } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Statistical')
@Controller('statistical')
export class StatisticalController {
  constructor(private readonly statisticalService: StatisticalService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Thống kê',
  })
  async getOverviewStatistics() {
    return this.statisticalService.getOverallStatistics();
  }
}
