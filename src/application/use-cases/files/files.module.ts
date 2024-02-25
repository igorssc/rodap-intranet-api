import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UploadProfilePictureService } from './user/upload-profile-picture.service';
import { CompressPictureService } from './compress-picture.service';
import { UploadUniqueFileToS3Service } from './upload-unique-file-to-s3.service';
import { DeleteUniqueFileFromS3Service } from './delete-unique-file-from-s3.service';
import { DeleteProfilePictureService } from './user/delete-profile-picture.service';

@Module({
  imports: [UsersModule],
  providers: [
    UploadProfilePictureService,
    DeleteProfilePictureService,
    CompressPictureService,
    UploadUniqueFileToS3Service,
    DeleteUniqueFileFromS3Service,
  ],
  exports: [UploadProfilePictureService, DeleteProfilePictureService],
})
export class FilesModule {}
