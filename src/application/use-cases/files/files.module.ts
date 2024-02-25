import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UploadPictureProfileService } from './user/upload-picture-profile.service';
import { CompressPictureService } from './compress-picture.service';
import { UploadUniqueFileToS3Service } from './upload-unique-file-to-s3.service';
import { DeleteUniqueFileFromS3Service } from './delete-unique-file-from-s3.service';
import { DeletePictureProfileService } from './user/delete-picture-profile.service';

@Module({
  imports: [UsersModule],
  providers: [
    UploadPictureProfileService,
    DeletePictureProfileService,
    CompressPictureService,
    UploadUniqueFileToS3Service,
    DeleteUniqueFileFromS3Service,
  ],
  exports: [UploadPictureProfileService, DeletePictureProfileService],
})
export class FilesModule {}
