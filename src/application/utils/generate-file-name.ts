import * as crypto from 'node:crypto';
import { removeAccents } from './remove-accents';

export const generateFileName = (originalName?: string) => {
  const fileHash = String(crypto.randomUUID());
  let fileName = fileHash;

  if (originalName) {
    fileName = fileName + '-' + originalName;
  }

  const fileNameWithoutAccents = removeAccents(fileName);

  const fileNameWithoutSpecialCharacters = fileNameWithoutAccents.replace(
    /[^a-zA-Z0-9]/g,
    '-',
  );

  return fileNameWithoutSpecialCharacters.toLowerCase();
};
