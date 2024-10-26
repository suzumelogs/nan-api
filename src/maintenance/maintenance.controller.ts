import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';

@ApiBearerAuth()
@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all maintenances',
    description: 'Retrieve a list of all maintenance records.',
  })
  findAll(): Promise<Maintenance[]> {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get maintenance by ID',
    description: 'Retrieve maintenance details by its ID.',
  })
  findOne(@Param('id') id: string): Promise<Maintenance> {
    return this.maintenanceService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new maintenance record',
    description: 'Create a new maintenance record with the provided details.',
  })
  create(
    @Body() createMaintenanceDto: CreateMaintenanceDto,
  ): Promise<Maintenance> {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update maintenance by ID',
    description:
      'Update the details of an existing maintenance record by its ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateMaintenanceDto: UpdateMaintenanceDto,
  ): Promise<Maintenance> {
    return this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete maintenance by ID',
    description: 'Delete a maintenance record by its ID.',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.maintenanceService.remove(id);
  }

  @Get('device/:deviceId')
  @ApiOperation({
    summary: 'Get maintenances by Device ID',
    description:
      'Retrieve a list of all maintenance records for a specific device.',
  })
  findByDeviceId(@Param('deviceId') deviceId: string): Promise<Maintenance[]> {
    return this.maintenanceService.findByDeviceId(deviceId);
  }
}
