import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';

@Module({
  controllers: [RentalController],
  imports: [AuthModule, PrismaModule],
  providers: [RentalService],
})
export class RentalModule {}
