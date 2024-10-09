import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '@prisma/client';

export class Device {
  @ApiProperty({
    description: 'Mã ID',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  id: string;

  @ApiProperty({
    description: 'Tên thiết bị',
    example: 'Canon EOS 90D DSLR Camera',
  })
  name: string;

  @ApiProperty({
    description: 'Mô tả thiết bị',
    example: 'Máy ảnh DSLR chất lượng cao.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'URL hình ảnh',
    example: 'https://example.com/image.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Giá thuê hàng ngày',
    example: 50.0,
  })
  priceDay: number;

  @ApiProperty({
    description: 'Giá thuê hàng tuần',
    example: 300.0,
  })
  priceWeek: number;

  @ApiProperty({
    description: 'Giá thuê hàng tháng',
    example: 1000.0,
  })
  priceMonth: number;

  @ApiProperty({
    description: 'Trạng thái thiết bị',
    enum: DeviceStatus,
    example: DeviceStatus.available,
  })
  status: DeviceStatus;

  @ApiProperty({
    description: 'ID danh mục thiết bị',
    example: '60b9c3f3b236d17a10b76e6f',
  })
  categoryId: string;

  @ApiProperty({
    description: 'ID giỏ hàng (nếu có)',
    example: '60b9c3f3b236d17a10b76e6f',
    required: false,
  })
  cartId?: string;

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
