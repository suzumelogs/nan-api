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
import { RepairRecordService } from './repair-record.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RepairRecordFilterDto } from './dto/repair-record-create.dto';
import { RepairRecord } from '@prisma/client';
import { CreateRepairRecordDto } from './dto/create-repair-record.dto';
import { UpdateRepairRecordDto } from './dto/update-repair-record.dto';

@ApiBearerAuth()
@ApiTags('Repair Records')
@Controller('repair-records')
export class RepairRecordController {
  constructor(private readonly repairRecordService: RepairRecordService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả phiếu sửa chữa (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(@Query() filterDto: RepairRecordFilterDto): Promise<{
    data: RepairRecord[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, ...filters } = filterDto;
    return this.repairRecordService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Tất cả phiếu sửa chữa (Không phân trang)',
  })
  findAll(): Promise<{ data: RepairRecord[] }> {
    return this.repairRecordService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Phiếu sửa chữa theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: RepairRecord }> {
    return this.repairRecordService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo phiếu sửa chữa mới',
  })
  create(
    @Body() createRepairRecordDto: CreateRepairRecordDto,
  ): Promise<{ message: string }> {
    return this.repairRecordService.create(createRepairRecordDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật phiếu sửa chữa theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateRepairRecordDto: UpdateRepairRecordDto,
  ): Promise<{ message: string }> {
    return this.repairRecordService.update(id, updateRepairRecordDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa phiếu sửa chữa theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.repairRecordService.remove(id);
  }
}
