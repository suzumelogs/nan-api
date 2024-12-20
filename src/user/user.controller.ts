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
import { Role } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('pagination')
  @ApiOperation({
    summary: 'Lất tất cả user (Có phân trang và tìm kiếm)',
  })
  async findAllPagination(
    @Query() filterDto: UserFilterDto,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const { page, limit, ...filters } = filterDto;
    return this.userService.findAllPagination(page, limit, filters);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo mới người dùng',
  })
  @Auth(Role.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Tìm tất cả người dùng (Không phân trang)',
  })
  @Auth(Role.admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Tìm người dùng theo ID',
  })
  @Auth(Role.admin, Role.user)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.userService.findOne('id', id, user);
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Tìm người dùng theo EMAIL',
  })
  @Auth(Role.admin, Role.user)
  findOneByEmail(@Param('email') email: string, @GetUser() user: User) {
    return this.userService.findOne('email', email, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật người dùng theo ID',
  })
  @Auth(Role.admin, Role.user)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.update('id', id, updateUserDto, user);
  }

  @Patch('email/:email')
  @ApiOperation({
    summary: 'Cập nhật người dùng theo EMAIL',
  })
  @Auth(Role.admin, Role.user)
  updateByEmail(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.update('email', email, updateUserDto, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xoá người dùng theo ID',
  })
  @Auth(Role.admin, Role.user)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.userService.remove('id', id, user);
  }

  @Delete('email/:email')
  @ApiOperation({
    summary: 'Xoá người dùng theo EMAIL',
  })
  @Auth(Role.admin, Role.user)
  removeByEmail(@Param('email') email: string, @GetUser() user: User) {
    return this.userService.remove('email', email, user);
  }

  @Get('rentals/by-me')
  @ApiOperation({
    summary: 'Tìm tất cả lịch sử thuê của tôi',
  })
  @Auth(Role.user)
  getRentals(@GetUser() user: User) {
    return this.userService.getRentals(user);
  }
}
