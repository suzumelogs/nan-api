import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DeviceController],
  imports: [AuthModule, PrismaModule],
  providers: [DeviceService, PrismaService],
})
export class DeviceModule {}
