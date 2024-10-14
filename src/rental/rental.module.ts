import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';

@Module({
  controllers: [RentalController],
  providers: [RentalService],
  imports: [AuthModule, PrismaModule],
  exports: [],
})
export class RentalModule {}
