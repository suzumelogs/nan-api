import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<any> {
    if (dto.password !== dto.passwordconf)
      throw new BadRequestException('Passwords do not match');

    dto.email = dto.email.toLowerCase().trim();

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const { passwordconf, ...newUserData } = dto;
      newUserData.password = hashedPassword;

      const newuser = await this.prisma.user.create({
        data: newUserData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return {
        user: newuser,
        token: this.getJwtToken({
          id: newuser.id,
        }),
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('User already exists');
      }
      throw new InternalServerErrorException('Server error');
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    let user;
    try {
      user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Wrong credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Wrong credentials');
    }

    delete user.password;

    return {
      user,
      token: this.getJwtToken({
        id: user.id,
      }),
    };
  }

  async refreshToken(user: User) {
    return {
      user: user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
