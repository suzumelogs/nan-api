import { ApiProperty } from '@nestjs/swagger';

export class Discount {
  @ApiProperty({
    description: 'Mã ID',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Mã giảm giá',
    example: 'SUMMER2024',
  })
  code: string;

  @ApiProperty({
    description: 'Tỷ lệ giảm giá (%)',
    example: 20.0,
  })
  discountRate: number;

  @ApiProperty({
    description: 'Thời gian bắt đầu',
    example: '2024-06-01T00:00:00.000Z',
  })
  validFrom: Date;

  @ApiProperty({
    description: 'Thời gian kết thúc',
    example: '2024-08-31T00:00:00.000Z',
  })
  validTo: Date;

  @ApiProperty({
    description: 'Số lần sử dụng tối đa',
    example: 100,
    required: false,
  })
  maxUsage?: number;

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    example: '2024-01-10T00:00:00.000Z',
  })
  updatedAt: Date;
}
