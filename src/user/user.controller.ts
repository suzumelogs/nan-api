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
import { UpdateIdentityDocDto } from './dto/update-identity-doc.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateStatusDto } from './dto/update-status.sto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all/pagination')
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
  @Auth(Role.admin, Role.super_admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Tìm tất cả người dùng (Không phân trang)',
  })
  @Auth(Role.admin, Role.super_admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Tìm người dùng theo ID',
  })
  @Auth(Role.admin, Role.user, Role.super_admin)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.userService.findOne('id', id, user);
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Tìm người dùng theo EMAIL',
  })
  @Auth(Role.admin, Role.user, Role.super_admin)
  findOneByEmail(@Param('email') email: string, @GetUser() user: User) {
    return this.userService.findOne('email', email, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật người dùng theo ID',
  })
  @Auth(Role.admin, Role.user, Role.super_admin)
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
  @Auth(Role.admin, Role.user, Role.super_admin)
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
  @Auth(Role.admin, Role.user, Role.super_admin)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.userService.remove('id', id, user);
  }

  @Delete('email/:email')
  @ApiOperation({
    summary: 'Xoá người dùng theo EMAIL',
  })
  @Auth(Role.admin, Role.user, Role.super_admin)
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

  @Patch('update/identity-doc')
  @ApiOperation({
    summary: 'Cập nhật tài liệu nhận dạng của người dùng',
  })
  @Auth(Role.admin, Role.user, Role.super_admin)
  async updateIdentityDoc(
    @GetUser() user: User,
    @Body() dto: UpdateIdentityDocDto,
  ) {
    return this.userService.updateIdentityDoc(user.id, dto);
  }

  @Patch('update/profile')
  @ApiOperation({
    summary: 'Cập nhật thông tin của tôi',
  })
  @Auth(Role.user)
  async updateProfile(@GetUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user.id, dto);
  }

  @Patch(':id/identity-doc-status')
  @ApiOperation({ summary: 'Cập nhật trạng thái của chứng minh thư' })
  async updateIdentityDocStatus(
    @Param('id') userId: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.userService.updateIdentityDocStatus(userId, dto);
  }
}
