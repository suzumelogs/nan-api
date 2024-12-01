import { Module } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalController } from './statistical.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [StatisticalController],
  providers: [StatisticalService, PrismaService],
})
export class StatisticalModule {}
