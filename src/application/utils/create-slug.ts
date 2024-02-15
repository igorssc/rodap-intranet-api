import { removeAccents } from './removeAccents';

export function createSlug(text: string) {
  const textWithoutAccents = removeAccents(text);
  const trimmedText = textWithoutAccents.trim();
  const lowerCaseText = trimmedText.toLowerCase();
  const textWithHyphens = lowerCaseText.replace(/\s+/g, '-');
  const textWithAlphanumericAndHyphens = textWithHyphens.replace(
    /[^\w\-]+/g,
    '',
  );
  const textWithoutConsecutiveHyphens = textWithAlphanumericAndHyphens.replace(
    /\-\-+/g,
    '-',
  );
  const textWithoutLeadingHyphens = textWithoutConsecutiveHyphens.replace(
    /^-+/,
    '',
  );
  const finalText = textWithoutLeadingHyphens.replace(/-+$/, '');

  return finalText;
}
