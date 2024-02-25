import { UsersRepository } from '@/application/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DeleteUniqueFileFromS3Service } from '../delete-unique-file-from-s3.service';
import { extractFileNameFromS3Url } from '@/application/utils/extract-file-name-from-s3-url';
import { PartialUserWithMasterData } from '@/application/interfaces/user';

type DeleteProfilePictureServiceExecuteProps = PartialUserWithMasterData &
  Pick<User, 'profile_picture'>;

@Injectable()
export class DeleteProfilePictureService {
  constructor(
    private usersRepository: UsersRepository,
    private deleteUniqueFileFromS3Service: DeleteUniqueFileFromS3Service,
  ) {}

  async execute(user: DeleteProfilePictureServiceExecuteProps) {
    if (user.profile_picture) {
      const fileNameTakenFromOldProfilePhoto = extractFileNameFromS3Url(
        user.profile_picture,
      );

      await this.deleteUniqueFileFromS3Service.execute(
        fileNameTakenFromOldProfilePhoto,
      );
      const userUpdated = await this.usersRepository.update(user.id, {
        profile_picture: null,
      });

      return { user: userUpdated };
    }

    return { user };
  }
}
