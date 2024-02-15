export const extractFileNameFromS3Url = (url: string) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};
