import { UsersRepository } from '@/application/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CompressPictureService } from '../compress-picture.service';
import { UploadUniqueFileToS3Service } from '../upload-unique-file-to-s3.service';
import * as fs from 'node:fs';
import { DeleteUniqueFileFromS3Service } from '../delete-unique-file-from-s3.service';
import { extractFileNameFromS3Url } from '@/application/utils/extract-file-name-from-s3-url';
import { AvailableFormatInfo, FormatEnum } from 'sharp';

type ParseUser = Partial<User> & Pick<User, 'id' | 'profile_picture'>;

@Injectable()
export class UploadProfilePictureService {
  constructor(
    private usersRepository: UsersRepository,
    private compressPictureService: CompressPictureService,
    private uploadUniqueFileToS3Service: UploadUniqueFileToS3Service,
    private deleteUniqueFileFromS3Service: DeleteUniqueFileFromS3Service,
  ) {}

  async execute(user: ParseUser, file: Express.Multer.File) {
    const mimetype = 'webp' as keyof FormatEnum | AvailableFormatInfo;

    const newName = file.filename.split('.')[0] + '.' + mimetype;

    const fileCompressed = await this.compressPictureService.execute({
      mimetype,
      path: file.path,
      size: 500,
      quality: 50,
    });

    const fileNameUploaded = await this.uploadUniqueFileToS3Service.execute({
      fileName: 'profile-picture/' + newName,
      mimetype: mimetype as string,
      buffer: fileCompressed.buffer,
    });

    if (user.profile_picture) {
      const fileNameTakenFromOldProfilePhoto = extractFileNameFromS3Url(
        user.profile_picture,
      );

      await this.deleteUniqueFileFromS3Service.execute(
        fileNameTakenFromOldProfilePhoto,
      );
    }

    fs.unlink(file.path, (err) => {
      if (err) console.error(err);
    });

    const userUpdated = await this.usersRepository.update(user.id, {
      profile_picture: fileNameUploaded,
    });

    return { user: userUpdated };
  }
}
