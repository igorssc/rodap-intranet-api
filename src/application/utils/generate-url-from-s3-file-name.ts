export const generateUrlFromS3FileName = (fileName: string) => {
  return `https://${process.env.AWS_BUCKET_NAME}.s3.sa-east-1.amazonaws.com/${fileName}`;
};
