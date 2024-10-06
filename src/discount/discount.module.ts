import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService, PrismaService],
})
export class DiscountModule {}
