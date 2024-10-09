import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class User {
  @ApiProperty({
    description: 'Mã người dùng',
    example: '2313w49-0db7-4v79-aacc-52624343bf2t',
  })
  id: string;

  @ApiProperty({
    description: 'Tên người dùng',
    example: 'John Sample',
  })
  name: string;

  @ApiProperty({
    description: 'Email người dùng',
    uniqueItems: true,
    example: 'youremail@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Thời gian xác thực email',
    example: '2022-01-01T00:00:00.000Z',
  })
  emailVerified?: string;

  @ApiProperty({
    description: 'Vai trò người dùng (admin, user)',
    example: 'user',
  })
  role: Role;

  @ApiProperty({
    description: 'Thời gian tạo người dùng',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật người dùng',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt?: Date;
}
