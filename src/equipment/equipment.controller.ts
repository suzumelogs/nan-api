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
import { LabelValueResponse } from 'src/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { EquipmentFilterDto } from './dto/equipment-filter.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import { EquipmentService } from './equipment.service';

@ApiBearerAuth()
@ApiTags('Equipments')
@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Lấy tất cả thiết bị (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(@Query() filterDto: EquipmentFilterDto): Promise<{
    data: Equipment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, ...filters } = filterDto;
    return this.equipmentService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Lấy tất cả thiết bị (Không phân trang)',
  })
  findAll(): Promise<{ data: Equipment[] }> {
    return this.equipmentService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Lấy thiết bị theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Equipment }> {
    return this.equipmentService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo thiết bị mới',
  })
  create(@Body() createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật thiết bị theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa thiết bị theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.equipmentService.remove(id);
  }

  @Get('all/label-value')
  @ApiOperation({
    summary: 'Lấy tất cả thiết bị (Định dạng label-value)',
  })
  getLabelValue(): Promise<{ data: LabelValueResponse[] }> {
    return this.equipmentService.getLabelValue();
  }
}