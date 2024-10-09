import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RentalController],
  providers: [RentalService, PrismaService],
})
export class RentalModule {}
