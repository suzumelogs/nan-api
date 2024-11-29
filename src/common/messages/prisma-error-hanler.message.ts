import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const prismaErrorHandler = (error: any) => {
  console.log(error);

  if (error.code === 'P2002') {
    throw new BadRequestException('Dữ liệu đã tồn tại !');
  }

  if (error.code === 'P2025') {
    throw new BadRequestException('Không tìm thấy dữ liệu !');
  }

  throw new InternalServerErrorException(error.message || 'Lỗi máy chủ');
};
