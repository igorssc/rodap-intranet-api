import {
  FILE_NOT_FOUND,
  FILE_SIZE_EXCEEDED_10MB_MESSAGE,
  WRONG_FILE_TYPE_MESSAGE,
} from '@/application/errors/validations.constants';
import {
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export class ParseMultiDocumentsUpload extends ParseFilePipe {
  async transform(files: File[]): Promise<Express.Multer.File[]> {
    const filesArray = [] as Express.Multer.File[];

    for (const file of files) {
      if (!file) {
        throw new BadRequestException(FILE_NOT_FOUND);
      }

      const parsedFile = await super.transform(file);

      const fileTypeValidator = new FileTypeValidator({
        fileType: '.(png|jpeg|jpg|doc|docx|pdf|txt|xlsx|ppt)',
      });

      const isValidFileType = fileTypeValidator.isValid(file);

      if (!isValidFileType) {
        throw new BadRequestException(WRONG_FILE_TYPE_MESSAGE);
      }

      const maxFileSizeValidator = new MaxFileSizeValidator({
        maxSize: 1024 * 1024 * 10,
      });

      const isValidFileSize = maxFileSizeValidator.isValid(file);

      if (!isValidFileSize) {
        throw new BadRequestException(FILE_SIZE_EXCEEDED_10MB_MESSAGE);
      }

      filesArray.push(parsedFile);
    }

    return filesArray;
  }
}
