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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceFilterDto } from './dto/maintenance-filter.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';
import { MaintenanceService } from './maintenance.service';

@ApiBearerAuth()
@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('pagination')
  @ApiOperation({
    summary: 'Lấy tất cả lịch bảo trì (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(@Query() filterDto: MaintenanceFilterDto): Promise<{
    data: Maintenance[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, ...filters } = filterDto;
    return this.maintenanceService.findAllPagination(page, limit, filters);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả lịch bảo trì (Không phân trang)',
  })
  findAll(): Promise<Maintenance[]> {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy lịch bảo trì theo ID',
  })
  findOne(@Param('id') id: string): Promise<Maintenance> {
    return this.maintenanceService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo lịch bảo trì mới',
  })
  create(
    @Body() createMaintenanceDto: CreateMaintenanceDto,
  ): Promise<Maintenance> {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật lịch bảo trì theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateMaintenanceDto: UpdateMaintenanceDto,
  ): Promise<Maintenance> {
    return this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa lịch bảo trì theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.maintenanceService.remove(id);
  }

  @Get('device/:deviceId')
  @ApiOperation({
    summary: 'Lấy lịch bảo trì theo Device ID',
  })
  findByDeviceId(@Param('deviceId') deviceId: string): Promise<Maintenance[]> {
    return this.maintenanceService.findByDeviceId(deviceId);
  }
}
