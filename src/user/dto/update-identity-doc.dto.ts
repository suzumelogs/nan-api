import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateIdentityDocDto {
  @ApiProperty({
    description: 'Tài liệu nhận dạng',
  })
  @IsString()
  identityDoc: string;
}
