import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Endpoint for admins to create new users, including those with admin roles.',
  })
  @Auth(Role.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Endpoint for admins to retrieve a list of all users.',
  })
  @Auth(Role.admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieve user information by ID. Admins can access any user; users can access their own info.',
  })
  @Auth(Role.admin, Role.user)
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.userService.findOne('id', id, user);
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Get user by EMAIL',
    description:
      'Retrieve user information by email. Admins can access any user; users can access their own info.',
  })
  @Auth(Role.admin, Role.user)
  findOneByEmail(@Param('email') email: string, @GetUser() user: User) {
    return this.userService.findOne('email', email, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    description:
      'Update user data by ID. Admins can update any user; users can update their own info.',
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
    summary: 'Update user by EMAIL',
    description:
      'Update user data by email. Admins can update any user; users can update their own info.',
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
    summary: 'Delete user by ID',
    description:
      'Delete user by ID. Admins can delete any user; users can delete their own info.',
  })
  @Auth(Role.admin, Role.user)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.userService.remove('id', id, user);
  }

  @Delete('email/:email')
  @ApiOperation({
    summary: 'Delete user by EMAIL',
    description:
      'Delete user by email. Admins can delete any user; users can delete their own info.',
  })
  @Auth(Role.admin, Role.user)
  removeByEmail(@Param('email') email: string, @GetUser() user: User) {
    return this.userService.remove('email', email, user);
  }
}
