import { keyTranslator } from './translate-user-keys';

export const findDifferentKeys = (
  baseObj: any,
  compareObj: any,
  ignoreEmpty = false,
): string[] => {
  const differentKeys: string[] = [];

  for (const key in baseObj) {
    const baseContainsObj = baseObj.hasOwnProperty(key);

    const considerEmpty = !ignoreEmpty && compareObj.hasOwnProperty(key);

    if (baseContainsObj && considerEmpty) {
      if (baseObj[key]?.toString() !== compareObj[key]?.toString()) {
        const translatedKey = keyTranslator[key] || key;

        differentKeys.push(translatedKey);
      }
    }
  }

  return differentKeys;
};
