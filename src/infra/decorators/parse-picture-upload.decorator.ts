import {
  FILE_NOT_FOUND,
  FILE_SIZE_EXCEEDED_MESSAGE,
  WRONG_FILE_TYPE_MESSAGE,
} from '@/application/errors/validations.constants';
import {
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export class ParsePictureUpload extends ParseFilePipe {
  async transform(file: any): Promise<any> {
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
      maxSize: 1024 * 1024 * 2,
    });

    const isValidFileSize = maxFileSizeValidator.isValid(file);

    if (!isValidFileSize) {
      throw new BadRequestException(FILE_SIZE_EXCEEDED_MESSAGE);
    }

    return parsedFile;
  }
}
