import {
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export class ParsePictureUpload extends ParseFilePipe {
  async transform(file: any): Promise<any> {
    if (!file) {
      throw new BadRequestException('Arquivo não encontrado');
    }

    const parsedFile = await super.transform(file);

    const fileTypeValidator = new FileTypeValidator({
      fileType: '.(png|jpeg|jpg)',
    });

    fileTypeValidator.isValid(file);

    const maxFileSizeValidator = new MaxFileSizeValidator({
      maxSize: 1024 * 1024 * 2,
    });

    maxFileSizeValidator.isValid(file);

    return parsedFile;
  }
}
