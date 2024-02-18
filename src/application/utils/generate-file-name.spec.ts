import { describe, expect, it } from 'vitest';
import { generateFileName } from './generate-file-name';

describe('generateFileName function', () => {
  it('should generate a file name with random UUID if originalName is not provided', () => {
    const fileName = generateFileName();

    expect(fileName.length).toBeGreaterThanOrEqual(36);

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;

    expect(fileName.slice(0, 36)).toMatch(uuidPattern);
  });

  it('should generate a file name with originalName if provided', () => {
    const originalName = 'example.jpg';
    const fileName = generateFileName(originalName);

    expect(fileName).toContain('example-jpg');
  });

  it('should remove accents from generated file name', () => {
    const originalName = 'Café.png';
    const expectedFileName = expect.stringMatching(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-cafe.png/,
    );
    const fileName = generateFileName(originalName);

    expect(fileName).toEqual(expectedFileName);
  });

  it('should convert file name to lowercase', () => {
    const originalName = 'ExampleFile.JPG';
    const expectedFileName = expect.stringMatching(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-examplefile.jpg/,
    );
    const fileName = generateFileName(originalName);

    expect(fileName).toEqual(expectedFileName);
  });
});
