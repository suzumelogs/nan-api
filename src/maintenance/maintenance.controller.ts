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
import { Maintenance } from '@prisma/client';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceFilterDto } from './dto/maintenance-filter.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { MaintenanceService } from './maintenance.service';

@ApiBearerAuth()
@ApiTags('Maintenances')
@Controller('maintenances')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả lịch bảo trì (Có phân trang và tìm kiếm)',
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
    summary: 'Tất cả lịch bảo trì (Không phân trang)',
  })
  findAll(): Promise<{ data: Maintenance[] }> {
    return this.maintenanceService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Lịch bảo trì theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Maintenance }> {
    return this.maintenanceService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo lịch bảo trì mới',
  })
  create(
    @Body() createMaintenanceDto: CreateMaintenanceDto,
  ): Promise<{ message: string }> {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật lịch bảo trì theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateMaintenanceDto: UpdateMaintenanceDto,
  ): Promise<{ message: string }> {
    return this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa lịch bảo trì theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.maintenanceService.remove(id);
  }

  @Patch('status')
  @ApiOperation({
    summary: 'Cập nhật trạng thái bảo trì',
  })
  updateStatus(
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<{ message: string }> {
    return this.maintenanceService.updateStatus(updateStatusDto);
  }

  @Get('status/:status')
  @ApiOperation({
    summary: 'Lấy tất cả lịch bảo trì theo trạng thái',
  })
  findByStatus(
    @Param('status') status: string,
  ): Promise<{ data: Maintenance[] }> {
    return this.maintenanceService.findByStatus(status as any);
  }

  @Get('next-maintenance')
  @ApiOperation({
    summary: 'Lấy lịch bảo trì tiếp theo',
  })
  findNextMaintenance(): Promise<{ data: Maintenance }> {
    return this.maintenanceService.findNextMaintenance();
  }

  @Get('total-cost')
  @ApiOperation({
    summary: 'Tính tổng chi phí bảo trì theo bộ lọc',
  })
  calculateTotalCost(
    @Query() filterDto: MaintenanceFilterDto,
  ): Promise<{ totalCost: number }> {
    return this.maintenanceService.calculateTotalCost(filterDto);
  }

  @Get('history/:equipmentId')
  @ApiOperation({
    summary: 'Lịch sử bảo trì theo thiết bị',
  })
  getMaintenanceHistory(
    @Param('equipmentId') equipmentId: string,
  ): Promise<{ data: Maintenance[] }> {
    return this.maintenanceService.getMaintenanceHistory(equipmentId);
  }

  @Get('summary/:equipmentId')
  @ApiOperation({
    summary: 'Tổng hợp bảo trì theo thiết bị',
  })
  getMaintenanceSummaryByEquipment(
    @Param('equipmentId') equipmentId: string,
  ): Promise<{
    data: {
      totalCost: number;
      maintenanceCount: number;
      lastMaintenanceDate: Date | null;
    };
  }> {
    return this.maintenanceService.getMaintenanceSummaryByEquipment(
      equipmentId,
    );
  }

  @Post('bulk-create')
  @ApiOperation({
    summary: 'Tạo nhiều lịch bảo trì cùng lúc',
  })
  bulkCreate(
    @Body() createMaintenanceDto: CreateMaintenanceDto[],
  ): Promise<{ message: string }> {
    return this.maintenanceService.bulkCreate(createMaintenanceDto);
  }

  @Get('history/:equipmentId/date-range')
  @ApiOperation({
    summary: 'Lịch sử bảo trì theo thiết bị và khoảng thời gian',
  })
  getMaintenanceByEquipmentAndDateRange(
    @Param('equipmentId') equipmentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ data: Maintenance[] }> {
    return this.maintenanceService.getMaintenanceByEquipmentAndDateRange(
      equipmentId,
      startDate,
      endDate,
    );
  }
}
