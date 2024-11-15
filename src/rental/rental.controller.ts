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
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalService } from './rental.service';

@ApiBearerAuth()
@ApiTags('Rentals')
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('pagination')
  @ApiOperation({
    summary: 'Lấy tất cả các thuê (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: RentalFilterDto,
  ): Promise<{ data: Rental[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.rentalService.findAllPagination(page, limit, filters);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả các thuê (Không phân trang)',
  })
  findAll(): Promise<Rental[]> {
    return this.rentalService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thuê theo ID',
  })
  findOne(@Param('id') id: string): Promise<Rental> {
    return this.rentalService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo thuê mới',
  })
  @Auth(Role.admin)
  create(@Body() createRentalDto: CreateRentalDto): Promise<Rental> {
    return this.rentalService.create(createRentalDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thuê theo ID',
  })
  @Auth(Role.admin)
  update(
    @Param('id') id: string,
    @Body() updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    return this.rentalService.update(id, updateRentalDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa thuê theo ID',
  })
  @Auth(Role.admin)
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.rentalService.remove(id);
  }

  @Get('history/by-me')
  @ApiOperation({
    summary: 'Lấy tất cả lịch sử thuê của tôi',
  })
  @Auth(Role.user)
  getHistoryByMe(@GetUser() user: User) {
    return this.rentalService.getHistoryByMe(user.id);
  }
}
