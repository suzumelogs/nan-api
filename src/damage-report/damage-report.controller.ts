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
import { DamageReport, Role, User } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { DamageReportService } from './damage-report.service';
import { CreateDamageReportDto } from './dto/create-damage-report.dto';
import { DamageReportFilterDto } from './dto/damage-report-filter.dto';
import { UpdateStatus } from './dto/update-status.dto';

@ApiBearerAuth()
@ApiTags('Damage reports')
@Controller('damage-reports')
export class DamageReportController {
  constructor(private readonly damageReportService: DamageReportService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả báo hỏng (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(@Query() filterDto: DamageReportFilterDto): Promise<{
    data: DamageReport[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, ...filters } = filterDto;
    return this.damageReportService.findAllPagination(page, limit, filters);
  }

  @Get('get-by/:id')
  async findOne(@Param('id') id: string) {
    return await this.damageReportService.findOne(id);
  }

  @Post('create/by-me')
  @ApiOperation({
    summary: 'Báo hỏng',
  })
  @Auth(Role.user, Role.admin, Role.super_admin)
  async createByUser(
    @GetUser() user: User,
    @Body() dto: CreateDamageReportDto,
  ) {
    return await this.damageReportService.createByUser(user.id, dto);
  }

  @ApiOperation({
    summary: 'Cập nhật trạng thái',
  })
  @Patch('update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatus,
  ) {
    return await this.damageReportService.updateStatus(id, updateStatusDto);
  }

  @ApiOperation({
    summary: 'Xóa báo hỏng',
  })
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.damageReportService.remove(id);
  }

  @ApiOperation({
    summary: 'Báo hỏng của tôi',
  })
  @Get('get/by-me')
  @Auth(Role.user)
  async findByUser(@GetUser() user: User) {
    return await this.damageReportService.findByUser(user.id);
  }
}
