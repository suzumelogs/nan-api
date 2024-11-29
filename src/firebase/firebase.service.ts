import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import { firebaseConfig } from '../common/firebase/firebase.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private readonly storage;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

  constructor(private configService: ConfigService) {
    const config = firebaseConfig(this.configService);
    this.storage = getStorage(initializeApp(config));
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    this.validateFile(file);

    const blobName = this.generateBlobName(file.originalname);
    const storageRef = ref(this.storage, blobName);

    try {
      await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype,
      });
    } catch (error) {
      this.handleUploadError(error);
    }

    const url = await this.getDownloadUrl(storageRef);

    return { url };
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileRef = this.getFileReference(fileUrl);

    try {
      await deleteObject(fileRef);
    } catch (error) {
      throw new HttpException(
        `Unable to delete file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new HttpException(
        `File too large. Max size: ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new HttpException(
        `Invalid file type. Allowed types: ${this.ALLOWED_MIME_TYPES.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private generateBlobName(originalName: string): string {
    return `Device/${uuidv4()}-${originalName}`;
  }

  private async getDownloadUrl(storageRef: any): Promise<string> {
    try {
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new HttpException(
        `Failed to get file URL: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getFileReference(fileUrl: string): any {
    try {
      const filePath = this.extractFilePathFromUrl(fileUrl);
      return ref(this.storage, filePath);
    } catch (error) {
      throw new HttpException(
        `Failed to get file reference: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private extractFilePathFromUrl(fileUrl: string): string {
    const decodedUrl = decodeURIComponent(fileUrl);
    const regex = /\/o\/(.+)\?/;
    const match = decodedUrl.match(regex);
    if (!match || match.length < 2) {
      throw new HttpException('Invalid file URL', HttpStatus.BAD_REQUEST);
    }
    return match[1];
  }

  private handleUploadError(error: any): void {
    throw new HttpException(
      `Unable to upload file: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
