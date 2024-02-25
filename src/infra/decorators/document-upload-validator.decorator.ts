import { UploadedFile } from '@nestjs/common';
import { ParseDocumentUpload } from './parse-document-upload.decorator';

export const DocumentUploadValidator = () =>
  UploadedFile(new ParseDocumentUpload());
