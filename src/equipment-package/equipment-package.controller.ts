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
import { EquipmentPackage } from '@prisma/client'; // Thay đổi theo mô hình của bạn
import { LabelValueResponse } from 'src/common';
import { CreateEquipmentPackageDto } from './dto/create-equipment-package.dto'; // Thêm DTO tương ứng
import { EquipmentPackageFilterDto } from './dto/equipment-package-filter.dto'; // Thêm DTO lọc tương ứng
import { UpdateEquipmentPackageDto } from './dto/update-equipment-package.dto'; // Thêm DTO cập nhật
import { EquipmentPackageService } from './equipment-package.service';

@ApiBearerAuth()
@ApiTags('Equipment Packages')
@Controller('equipment-package')
export class EquipmentPackageController {
  constructor(
    private readonly equipmentPackageService: EquipmentPackageService,
  ) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Lấy tất cả gói thiết bị (Có phân trang và tìm kiếm)',
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
    summary: 'Lấy tất cả gói thiết bị (Không phân trang)',
  })
  findAll(): Promise<{ data: EquipmentPackage[] }> {
    return this.equipmentPackageService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Lấy gói thiết bị theo ID',
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
  ): Promise<EquipmentPackage> {
    return this.equipmentPackageService.create(createEquipmentPackageDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật gói thiết bị theo ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateEquipmentPackageDto: UpdateEquipmentPackageDto,
  ): Promise<EquipmentPackage> {
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
    summary: 'Lấy tất cả gói thiết bị (Định dạng label-value)',
  })
  getLabelValue(): Promise<{ data: LabelValueResponse[] }> {
    return this.equipmentPackageService.getLabelValue();
  }
}
