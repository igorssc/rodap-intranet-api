import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from '../config/multer';

export const PictureUploadInterceptor = () => {
  const fileInterceptor = FileInterceptor('file', multerConfig);

  return applyDecorators(UseInterceptors(fileInterceptor));
};
