import { UsersRepository } from '@/application/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CompressPictureService } from '../compress-picture.service';
import { UploadUniqueFileToS3Service } from '../upload-unique-file-to-s3.service';
import * as fs from 'node:fs';
import { DeleteUniqueFileFromS3Service } from '../delete-unique-file-from-s3.service';
import { extractFileNameFromS3Url } from '@/application/utils/extract-file-name-from-s3-url';

@Injectable()
export class UploadPictureProfileService {
  constructor(
    private usersRepository: UsersRepository,
    private compressPictureService: CompressPictureService,
    private uploadUniqueFileToS3Service: UploadUniqueFileToS3Service,
    private deleteUniqueFileFromS3Service: DeleteUniqueFileFromS3Service,
  ) {}

  async execute(user: User, file: Express.Multer.File) {
    const fileCompressed = await this.compressPictureService.execute({
      fileName: file.filename,
      mimetype: 'webp',
      path: file.path,
      size: 500,
      quality: 50,
    });

    const fileNameUploaded = await this.uploadUniqueFileToS3Service.execute({
      fileName: fileCompressed.fileName,
      mimetype: fileCompressed.mimetype,
      buffer: fileCompressed.buffer,
      path: file.path,
    });

    if (user.picture_profile) {
      const fileNameTakenFromOldProfilePhoto = extractFileNameFromS3Url(
        user.picture_profile,
      );

      await this.deleteUniqueFileFromS3Service.execute(
        fileNameTakenFromOldProfilePhoto,
      );
    }

    fs.unlink(file.path, (err) => {
      if (err) console.error(err);
    });

    const userUpdated = await this.usersRepository.update(user.id, {
      picture_profile: fileNameUploaded,
    });

    return { user: userUpdated };
  }
}
