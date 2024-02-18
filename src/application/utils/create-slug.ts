import { removeAccents } from './remove-accents';

export function createSlug(text: string) {
  const textWithoutAccents = removeAccents(text);
  const trimmedText = textWithoutAccents.trim();
  const lowerCaseText = trimmedText.toLowerCase();
  const textWithoutUnderlines = lowerCaseText.replace(/_+/g, '-');
  const textWithHyphens = textWithoutUnderlines.replace(/\s+/g, '-');
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
