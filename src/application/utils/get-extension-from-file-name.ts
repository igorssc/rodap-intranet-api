export const getExtensionFromFileName = (fileName: string): string | null => {
  const regex = /\.([0-9a-z]+)$/i;
  const match = fileName.match(regex);

  return match ? match[1].toLowerCase() : null;
};
