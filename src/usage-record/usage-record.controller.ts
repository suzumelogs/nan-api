import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsageRecordService } from './usage-record.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsageRecordFilterDto } from './dto/usage-record-filter.dto';
import { UsageRecord } from '@prisma/client';
import { CreateUsageRecordDto } from './dto/create-usage-record.dto';
import { UpdateUsageRecordDto } from './dto/update-usage-record.dto';

@ApiBearerAuth()
@ApiTags('Usage Records')
@Controller('usage-records')
export class UsageRecordController {
  constructor(private readonly usageRecordService: UsageRecordService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả phiếu sử dụng (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(@Query() filterDto: UsageRecordFilterDto): Promise<{
    data: UsageRecord[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, ...filters } = filterDto;
    return this.usageRecordService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Tất cả phiếu sử dụng (Không phân trang)',
  })
  findAll(): Promise<{ data: UsageRecord[] }> {
    return this.usageRecordService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Phiếu sử dụng theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: UsageRecord }> {
    return this.usageRecordService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo phiếu sử dụng mới',
  })
  create(
    @Body() createUsageRecordDto: CreateUsageRecordDto,
  ): Promise<{ message: string }> {
    return this.usageRecordService.create(createUsageRecordDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật phiếu sử dụng theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateUsageRecordDto: UpdateUsageRecordDto,
  ): Promise<{ message: string }> {
    return this.usageRecordService.update(id, updateUsageRecordDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa phiếu sử dụng theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.usageRecordService.remove(id);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Thống kê lịch sử sử dụng',
  })
  getStatistics(): Promise<{
    totalUsage: number;
    totalDuration: number;
    totalIncidents: number;
  }> {
    return this.usageRecordService.getStatistics();
  }

  @Get('unreturned')
  @ApiOperation({
    summary: 'Danh sách phiếu sử dụng chưa trả',
  })
  findUnreturnedRecords(): Promise<{ data: UsageRecord[] }> {
    return this.usageRecordService.findUnreturnedRecords();
  }

  @Delete('bulk-delete')
  @ApiOperation({
    summary: 'Xóa nhiều phiếu sử dụng',
  })
  bulkDelete(@Body('ids') ids: string[]): Promise<{ message: string }> {
    return this.usageRecordService.bulkDelete(ids);
  }

  @Get('equipment/:equipmentId')
  @ApiOperation({
    summary: 'Lấy lịch sử sử dụng theo thiết bị',
  })
  findByEquipmentId(
    @Param('equipmentId') equipmentId: string,
  ): Promise<{ data: UsageRecord[] }> {
    return this.usageRecordService.findByEquipmentId(equipmentId);
  }

  @Patch('mark-as-returned/:id')
  @ApiOperation({
    summary: 'Đánh dấu thiết bị đã trả',
  })
  markAsReturned(
    @Param('id') id: string,
    @Body('returnDate') returnDate: Date,
  ): Promise<{ message: string }> {
    return this.usageRecordService.markAsReturned(id, new Date(returnDate));
  }
}
