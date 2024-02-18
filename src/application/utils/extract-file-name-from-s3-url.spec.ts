import { describe, expect, it } from 'vitest';
import { extractFileNameFromS3Url } from './extract-file-name-from-s3-url';

describe('extractFileNameFromS3Url function', () => {
  it('should extract file name from a given S3 URL', () => {
    const url =
      'https://example.s3.sa-east-1.amazonaws.com/f1386d41-b82e-4770-970f-daf1ac7f448a-captura-de-tela-de-2024-02-16-16-37-35.webp';
    const expectedOutput =
      'f1386d41-b82e-4770-970f-daf1ac7f448a-captura-de-tela-de-2024-02-16-16-37-35.webp';

    expect(extractFileNameFromS3Url(url)).toBe(expectedOutput);
  });

  it('should handle empty URL input', () => {
    const url = '';
    const expectedOutput = '';

    expect(extractFileNameFromS3Url(url)).toBe(expectedOutput);
  });

  it('should handle URL with trailing slash', () => {
    const url = 'https://example.s3.sa-east-1.amazonaws.com/';
    const expectedOutput = '';

    expect(extractFileNameFromS3Url(url)).toBe(expectedOutput);
  });

  it('should handle URL with no file name', () => {
    const url = 'https://example.s3.sa-east-1.amazonaws.com/';
    const expectedOutput = '';

    expect(extractFileNameFromS3Url(url)).toBe(expectedOutput);
  });
});
