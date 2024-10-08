import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@ApiBearerAuth()
@ApiTags('Devices')
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all devices',
    description: 'Retrieve a list of all devices available.',
  })
  findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get device by ID',
    description: 'Retrieve device details by its ID.',
  })
  findOne(@Param('id') id: string): Promise<Device> {
    return this.deviceService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new device',
    description: 'Create a new device with the provided details.',
  })
  create(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return this.deviceService.create(createDeviceDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update device by ID',
    description: 'Update the details of an existing device by its ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device> {
    return this.deviceService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete device by ID',
    description: 'Delete a device by its ID.',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.deviceService.remove(id);
  }
}
