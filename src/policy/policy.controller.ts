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
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PolicyFilterDto } from './dto/policy-filter.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { Policy } from './entities/policy.entity';
import { PolicyService } from './policy.service';

@ApiBearerAuth()
@ApiTags('Policies')
@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get('pagination')
  @ApiOperation({
    summary: 'Lấy tất cả chính sách (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: PolicyFilterDto,
  ): Promise<{ data: Policy[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.policyService.findAllPagination(page, limit, filters);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả chính sách (Không phân trang)',
  })
  async findAll(): Promise<Policy[]> {
    return this.policyService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chính sách theo ID',
  })
  async findOne(@Param('id') id: string): Promise<Policy> {
    return this.policyService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo chính sách mới',
  })
  async create(@Body() createPolicyDto: CreatePolicyDto): Promise<Policy> {
    return this.policyService.create(createPolicyDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật chính sách theo ID',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ): Promise<Policy> {
    return this.policyService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa chính sách theo ID',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.policyService.remove(id);
  }
}
