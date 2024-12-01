import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FirebaseService } from './firebase/firebase.service';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { NotificationModule } from './notification/notification.module';
import { PolicyModule } from './policy/policy.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { EquipmentModule } from './equipment/equipment.module';
import { EquipmentPackageModule } from './equipment-package/equipment-package.module';
import { RentalModule } from './rental/rental.module';
import { DamageReportModule } from './damage-report/damage-report.module';
import { UploadModule } from './upload/upload.module';
import { RepairRecordModule } from './repair-record/repair-record.module';
import { UsageRecordModule } from './usage-record/usage-record.module';
import { MailerConfigModule } from './mail/mail.module';
import { StatisticalModule } from './statistical/statistical.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    DiscountModule,
    CategoryModule,
    PolicyModule,
    FeedbackModule,
    MaintenanceModule,
    NotificationModule,
    CartModule,
    EquipmentModule,
    EquipmentPackageModule,
    RentalModule,
    DamageReportModule,
    UploadModule,
    RepairRecordModule,
    UsageRecordModule,
    MailerConfigModule,
    StatisticalModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
