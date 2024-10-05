import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { RegisterUserDto } from './dto/register-user.dto';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'REGISTER',
    description: 'Public endpoint to register a new user with "user" role.',
  })
  register(@Body() createUserDto: RegisterUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'LOGIN',
    description: 'Public endpoint to login and obtain an access token.',
  })
  async login(@Res() response, @Body() loginUserDto: LoginUserDto) {
    const data = await this.authService.loginUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    response.status(HttpStatus.OK).send(data);
  }

  @Get('refresh-token')
  @ApiOperation({
    summary: 'REFRESH TOKEN',
    description:
      'Private endpoint for logged-in users to refresh their access token.',
  })
  @ApiBearerAuth()
  @Auth()
  refreshToken(@GetUser() user: User) {
    return this.authService.refreshToken(user);
  }
}
