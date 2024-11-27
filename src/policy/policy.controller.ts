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
import { Policy } from '@prisma/client';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PolicyFilterDto } from './dto/policy-filter.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyService } from './policy.service';

@ApiBearerAuth()
@ApiTags('Policies')
@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả chính sách (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: PolicyFilterDto,
  ): Promise<{ data: Policy[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.policyService.findAllPagination(page, limit, filters);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Tất cả chính sách (Không phân trang)',
  })
  async findAll(): Promise<{ data: Policy[] }> {
    return this.policyService.findAll();
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Chính sách theo ID',
  })
  async findOne(@Param('id') id: string): Promise<{ data: Policy }> {
    return this.policyService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo chính sách mới',
  })
  async create(@Body() createPolicyDto: CreatePolicyDto): Promise<Policy> {
    return this.policyService.create(createPolicyDto);
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Cập nhật chính sách theo ID',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ): Promise<Policy> {
    return this.policyService.update(id, updatePolicyDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa chính sách theo ID',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.policyService.remove(id);
  }
}
