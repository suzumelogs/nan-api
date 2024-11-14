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
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceFilterDto } from './dto/device-filter.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Devices')
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('pagination')
  @ApiOperation({
    summary: 'Lấy tất cả thiết bị (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: DeviceFilterDto,
  ): Promise<{ data: Device[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.deviceService.findAllPagination(page, limit, filters);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả thiết bị (Không phân trang)',
  })
  findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thiết bị theo ID',
  })
  findOne(@Param('id') id: string): Promise<Device> {
    return this.deviceService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo thiết bị mới',
  })
  create(@Body() createDeviceDto: CreateDeviceDto): Promise<Device> {
    return this.deviceService.create(createDeviceDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thiết bị theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device> {
    return this.deviceService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa thiết bị theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.deviceService.remove(id);
  }
}
