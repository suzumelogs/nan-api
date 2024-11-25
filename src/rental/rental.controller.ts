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
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';
import { RentalService } from './rental.service';

@ApiBearerAuth()
@ApiTags('Rentals')
@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('all/pagination')
  @ApiOperation({
    summary: 'Tất cả đơn thuê (Có phân trang và tìm kiếm)',
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

  @Get(':id')
  @ApiOperation({
    summary: 'Đơn thuê theo ID',
  })
  findOne(@Param('id') id: string): Promise<{ data: Rental }> {
    return this.rentalService.findOne(id);
  }

  @Get('get-by/me')
  @ApiOperation({
    summary: 'Đơn thuê của tôi theo ID',
  })
  @Auth(Role.user)
  async findByMe(@GetUser() user: User): Promise<{ data: Rental[] }> {
    return this.rentalService.findByMe(user.id);
  }

  @Post('create/by-me')
  @ApiOperation({ summary: 'Thuê thiết bị (gói thiết bị) của tôi' })
  @Auth(Role.user)
  async createRentalByMe(
    @GetUser() user: User,
    @Body() createRentalDto: CreateRentalDto,
  ): Promise<Rental> {
    return this.rentalService.createRentalByMe(user.id, createRentalDto);
  }

  @Delete('remove/:id')
  @ApiOperation({
    summary: 'Xóa đơn thuê theo ID',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.rentalService.remove(id);
  }

  @Patch('confirm/:id')
  @ApiOperation({
    summary: 'Xác nhận đơn thuê',
  })
  async confirmRental(@Param('id') id: string): Promise<Rental> {
    return this.rentalService.confirmRental(id);
  }

  @Patch('cancel/:id')
  @ApiOperation({
    summary: 'Hủy đơn thuê',
  })
  async cancelRental(@Param('id') id: string): Promise<{ message: string }> {
    return this.rentalService.cancelRental(id);
  }

  @Delete('clear-all/by-me')
  @ApiOperation({
    summary: 'Xóa toàn bộ đơn thuê của tôi',
  })
  @Auth(Role.user)
  async clearAllByMe(@GetUser() user: User): Promise<{ message: string }> {
    return this.rentalService.clearAllByMe(user.id);
  }
}
