import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EquipmentPackageController } from './equipment-package.controller';
import { EquipmentPackageService } from './equipment-package.service';

@Module({
  controllers: [EquipmentPackageController],
  providers: [EquipmentPackageService, PrismaService],
})
export class EquipmentPackageModule {}
