import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { FirebaseService } from './firebase/firebase.service';
import { DiscountModule } from './discount/discount.module';
import { DeviceModule } from './device/device.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    DiscountModule,
    DeviceModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
