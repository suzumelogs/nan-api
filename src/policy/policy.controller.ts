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
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { Policy } from './entities/policy.entity';

@ApiBearerAuth()
@ApiTags('Policies')
@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all policies',
    description: 'Retrieve a list of all policies available.',
  })
  async findAll(): Promise<Policy[]> {
    return this.policyService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get policy by ID',
    description: 'Retrieve policy details by its ID.',
  })
  async findOne(@Param('id') id: string): Promise<Policy> {
    return this.policyService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new policy',
    description: 'Create a new policy with the provided details.',
  })
  async create(@Body() createPolicyDto: CreatePolicyDto): Promise<Policy> {
    return this.policyService.create(createPolicyDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update policy by ID',
    description: 'Update the details of an existing policy by its ID.',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ): Promise<Policy> {
    return this.policyService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete policy by ID',
    description: 'Delete a policy by its ID.',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.policyService.remove(id);
  }
}
