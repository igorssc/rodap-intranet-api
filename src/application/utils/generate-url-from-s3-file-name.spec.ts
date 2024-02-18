import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateUrlFromS3FileName } from './generate-url-from-s3-file-name';

describe('generateUrlFromS3FileName function', () => {
  beforeEach(() => {
    process.env.AWS_BUCKET_NAME = 'example-bucket';
  });

  afterEach(() => {
    delete process.env.AWS_BUCKET_NAME;
  });

  it('should generate a URL from a given S3 file name', () => {
    const fileName = 'example-file.jpg';
    const expectedUrl =
      'https://example-bucket.s3.sa-east-1.amazonaws.com/example-file.jpg';

    expect(generateUrlFromS3FileName(fileName)).toEqual(expectedUrl);
  });
});
