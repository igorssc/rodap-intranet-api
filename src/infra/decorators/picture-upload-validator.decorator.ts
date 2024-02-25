import { UploadedFile } from '@nestjs/common';
import { ParsePictureUpload } from './parse-picture-upload.decorator';

export const PictureUploadValidator = () =>
  UploadedFile(new ParsePictureUpload());
