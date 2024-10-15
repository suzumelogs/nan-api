import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { QueryService } from 'src/common/services/query.service';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService, PrismaService, QueryService],
})
export class DiscountModule {}
