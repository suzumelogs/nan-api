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
import { Equipment, EquipmentPackage } from '@prisma/client';
import { LabelValueResponse } from 'src/common';
import { CreateEquipmentPackageDto } from './dto/create-equipment-package.dto';
import { EquipmentPackageFilterDto } from './dto/equipment-package-filter.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateEquipmentPackageDto } from './dto/update-equipment-package.dto';
import { EquipmentPackageService } from './equipment-package.service';
import { AddEquipmentsToPackageDto } from './dto/add-equipments-to-package.dto';

@ApiBearerAuth()
@ApiTags('Equipment Packages')
@Controller('equipments-package')
export class EquipmentPackageController {
  constructor(
    private readonly equipmentPackageService: EquipmentPackageService,
  ) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả gói thiết bị (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: EquipmentPackageFilterDto,
  ): Promise<{
    data: EquipmentPackage[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, ...filters } = filterDto;
    return this.equipmentPackageService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Tất cả gói thiết bị (Không phân trang)',
  })
  findAll(): Promise<{ data: EquipmentPackage[] }> {
    return this.equipmentPackageService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Thiết bị theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: EquipmentPackage }> {
    return this.equipmentPackageService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo gói thiết bị mới',
  })
  create(
    @Body() createEquipmentPackageDto: CreateEquipmentPackageDto,
  ): Promise<{ message: string }> {
    return this.equipmentPackageService.create(createEquipmentPackageDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật gói thiết bị theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateEquipmentPackageDto: UpdateEquipmentPackageDto,
  ): Promise<{ message: string }> {
    return this.equipmentPackageService.update(id, updateEquipmentPackageDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa gói thiết bị theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.equipmentPackageService.remove(id);
  }

  @Get('all/label-value')
  @ApiOperation({
    summary: 'Tất cả gói thiết bị (Định dạng label-value)',
  })
  getLabelValue(): Promise<{ data: LabelValueResponse[] }> {
    return this.equipmentPackageService.getLabelValue();
  }

  @Get(':id/equipments/all/pagination')
  @ApiOperation({
    summary: 'Lấy danh sách thiết bị của gói thiết bị (Có phân trang)',
  })
  async getEquipments(
    @Param('id') id: string,
    @Query() dto: PaginationDto,
  ): Promise<{ data: Equipment[]; total: number }> {
    return this.equipmentPackageService.getEquipmentsWithPagination(id, dto);
  }

  @Post('add/equipments-to-package')
  async addEquipmentsToPackage(
    @Body() dto: AddEquipmentsToPackageDto,
  ): Promise<{ message: string }> {
    return this.equipmentPackageService.addEquipmentsToPackage(dto);
  }
}
