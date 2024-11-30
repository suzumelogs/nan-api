import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  controllers: [RentalController],
  imports: [AuthModule, PrismaModule],
  providers: [RentalService, NotificationService],
})
export class RentalModule {}
