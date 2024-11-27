import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { EquipmentPackageController } from './equipment-package.controller';
import { EquipmentPackageService } from './equipment-package.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [EquipmentPackageController],
  providers: [EquipmentPackageService, PrismaService],
})
export class EquipmentPackageModule {}
