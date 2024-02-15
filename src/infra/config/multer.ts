import { diskStorage } from 'multer';
import * as path from 'node:path';
import { generateFileName } from '@/application/utils/generate-file-name';

export const multerConfig = {
  storage: diskStorage({
    destination: path.resolve(__dirname, '..', '..', '..', 'tmp'),
    filename: (_req, file, cb) => {
      const fileNameWithoutExtension = file.originalname.replace(
        /\.[^.]*$/,
        '',
      );

      const fileName = generateFileName(fileNameWithoutExtension);

      cb(null, fileName);
    },
  }),
};

export default multerConfig;
