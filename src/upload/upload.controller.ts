import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FirebaseService } from 'src/firebase/firebase.service';

@ApiBearerAuth()
@ApiTags('Uploads')
@Controller('upload')
export class UploadController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @ApiOperation({
    summary: 'Upload file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a file',
    type: 'multipart/form-data',
  })
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.firebaseService.uploadFile(file);
  }
}
