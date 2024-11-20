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
import { Rental, Role, User } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { AddTtemToRentalDto } from './dto/add-item-to-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';
import { UpdateRentalStatusDto } from './dto/update-rental-status.dto';
import { RentalService } from './rental.service';

@ApiBearerAuth()
@ApiTags('Rentals')
@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Lấy tất cả đơn thuê (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(@Query() filterDto: RentalFilterDto): Promise<{
    data: Rental[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, ...filters } = filterDto;
    return this.rentalService.findAllPagination(page, limit, filters);
  }

  @Get('get-by/:id')
  @ApiOperation({
    summary: 'Lấy đơn thuê theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Rental }> {
    return this.rentalService.findOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Thuê thiết bị (gói thiết bị) của tôi' })
  @Auth(Role.user)
  async createRental(
    @GetUser() user: User,
    @Body() createRentalDto: CreateRentalDto,
  ): Promise<Rental> {
    return this.rentalService.createRental(user.id, createRentalDto);
  }

  @Patch('update-status/:id')
  @ApiOperation({
    summary: 'Cập nhật trạng thái đơn thuê',
  })
  async updateRentalStatus(
    @Param('id') id: string,
    @Body() updateRentalStatusDto: UpdateRentalStatusDto,
  ) {
    return this.rentalService.updateRentalStatus(id, updateRentalStatusDto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Lấy tất cả đơn thuê của người dùng theo ID',
  })
  @Auth(Role.user)
  async getRentalsByUser(@GetUser() user: User): Promise<{ data: Rental[] }> {
    return this.rentalService.getRentalsByUser(user.id);
  }

  @Post('add-item/:id')
  @ApiOperation({
    summary: 'Thêm thiết bị vào đơn thuê',
  })
  async addItemToRental(
    @Param('id') rentalId: string,
    @Body() addTtemToRentalDto: AddTtemToRentalDto,
  ) {
    return this.rentalService.addItemToRental(rentalId, addTtemToRentalDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa đơn thuê theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.rentalService.remove(id);
  }
}
