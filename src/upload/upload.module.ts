import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UploadController],
  providers: [FirebaseService, ConfigService],
})
export class UploadModule {}
