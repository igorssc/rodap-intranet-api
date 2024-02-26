import {
  FILE_NOT_FOUND,
  FILE_SIZE_EXCEEDED_5MB_MESSAGE,
  WRONG_FILE_TYPE_MESSAGE,
} from '@/application/errors/validations.constants';
import {
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export class ParsePictureUpload extends ParseFilePipe {
  async transform(file: File): Promise<Express.Multer.File> {
    if (!file) {
      throw new BadRequestException(FILE_NOT_FOUND);
    }

    const parsedFile = await super.transform(file);

    const fileTypeValidator = new FileTypeValidator({
      fileType: '.(png|jpeg|jpg)',
    });

    const isValidFileType = fileTypeValidator.isValid(file);

    if (!isValidFileType) {
      throw new BadRequestException(WRONG_FILE_TYPE_MESSAGE);
    }

    const maxFileSizeValidator = new MaxFileSizeValidator({
      maxSize: 1024 * 1024 * 5,
    });

    const isValidFileSize = maxFileSizeValidator.isValid(file);

    if (!isValidFileSize) {
      throw new BadRequestException(FILE_SIZE_EXCEEDED_5MB_MESSAGE);
    }

    return parsedFile;
  }
}
