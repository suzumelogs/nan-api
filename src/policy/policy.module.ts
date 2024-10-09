import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PolicyController],
  providers: [PolicyService, PrismaService],
})
export class PolicyModule {}
