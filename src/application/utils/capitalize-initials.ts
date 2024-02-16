export const capitalizeInitials = (input: string) => {
  const words: string[] = input.split(' ');

  const capitalizedWords: string[] = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  const capitalizedString: string = capitalizedWords.join(' ');

  return capitalizedString;
};
