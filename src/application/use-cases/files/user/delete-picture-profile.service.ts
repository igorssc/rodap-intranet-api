import { UsersRepository } from '@/application/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DeleteUniqueFileFromS3Service } from '../delete-unique-file-from-s3.service';
import { extractFileNameFromS3Url } from '@/application/utils/extract-file-name-from-s3-url';
import { PartialUserWithMasterData } from '@/application/interfaces/user';

type DeletePictureProfileServiceExecuteProps = PartialUserWithMasterData &
  Pick<User, 'picture_profile'>;

@Injectable()
export class DeletePictureProfileService {
  constructor(
    private usersRepository: UsersRepository,
    private deleteUniqueFileFromS3Service: DeleteUniqueFileFromS3Service,
  ) {}

  async execute(user: DeletePictureProfileServiceExecuteProps) {
    if (user.picture_profile) {
      const fileNameTakenFromOldProfilePhoto = extractFileNameFromS3Url(
        user.picture_profile,
      );

      await this.deleteUniqueFileFromS3Service.execute(
        fileNameTakenFromOldProfilePhoto,
      );
      const userUpdated = await this.usersRepository.update(user.id, {
        picture_profile: null,
      });

      return { user: userUpdated };
    }

    return { user };
  }
}
