import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';

@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService, PrismaService],
})
export class EquipmentModule {}
