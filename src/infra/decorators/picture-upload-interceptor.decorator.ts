import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from '../config/multer';
import { ParsePictureUpload } from './parse-picture-upload.decorator';

export const PictureUploadInterceptor = () => {
  const fileInterceptor = FileInterceptor('file', multerConfig);

  return applyDecorators(
    UseInterceptors(fileInterceptor),
    UsePipes(new ParsePictureUpload()),
  );
};
