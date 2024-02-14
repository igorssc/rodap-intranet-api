import { keyTranslator } from './translate-user-keys';

export const findDifferentKeys = (obj1: any, obj2: any): string[] => {
  const differentKeys: string[] = [];

  for (const key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      if (obj1[key].toString() !== obj2[key].toString()) {
        const translatedKey = keyTranslator[key] || key;

        differentKeys.push(translatedKey);
      }
    }
  }

  return differentKeys;
};
