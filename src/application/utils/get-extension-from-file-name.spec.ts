import { describe, expect, it } from 'vitest';
import { getExtensionFromFileName } from './get-extension-from-file-name';

describe('getExtensionFromFileName', () => {
  it('should return the file extension correctly', () => {
    expect(getExtensionFromFileName('document.pdf')).toBe('pdf');

    expect(getExtensionFromFileName('image.PNG')).toBe('png');

    expect(getExtensionFromFileName('fileWithoutExtension')).toBeNull();

    expect(getExtensionFromFileName('archive.tar.gz')).toBe('gz');
  });
});
