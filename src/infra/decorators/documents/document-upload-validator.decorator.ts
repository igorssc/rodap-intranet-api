import { UploadedFiles } from '@nestjs/common';
import { ParseMultiDocumentsUpload } from './parse-multi-documents-upload.decorator';

export const MultiDocumentsUploadValidator = () =>
  UploadedFiles(new ParseMultiDocumentsUpload());
