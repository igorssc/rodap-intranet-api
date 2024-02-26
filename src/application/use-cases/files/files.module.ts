import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UploadProfilePictureService } from './user/upload-profile-picture.service';
import { CompressPictureService } from './compress-picture.service';
import { UploadUniqueFileToS3Service } from './upload-unique-file-to-s3.service';
import { DeleteUniqueFileFromS3Service } from './delete-unique-file-from-s3.service';
import { DeleteProfilePictureService } from './user/delete-profile-picture.service';
import { InsertMessageAttachmentsService } from './support-ticket/insert-message-attachments.service';
import { SupportTicketMessagesModule } from '../support-ticket-messages/support-ticket-messages.module';

@Module({
  imports: [UsersModule, SupportTicketMessagesModule],
  providers: [
    UploadProfilePictureService,
    DeleteProfilePictureService,
    CompressPictureService,
    UploadUniqueFileToS3Service,
    DeleteUniqueFileFromS3Service,
    InsertMessageAttachmentsService,
  ],
  exports: [
    UploadProfilePictureService,
    DeleteProfilePictureService,
    InsertMessageAttachmentsService,
  ],
})
export class FilesModule {}
