import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import multerConfig from '../../config/multer';

export const MultiDocumentsUploadInterceptor = () => {
  const fileInterceptor = FilesInterceptor('file', 5, multerConfig);

  return applyDecorators(UseInterceptors(fileInterceptor));
};
