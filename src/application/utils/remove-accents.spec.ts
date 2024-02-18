import { describe, expect, it } from 'vitest';
import { removeAccents } from './remove-accents';

describe('removeAccents function', () => {
  it('should remove accents from a string', () => {
    const input = 'Café';
    const expectedOutput = 'Cafe';

    expect(removeAccents(input)).toEqual(expectedOutput);
  });

  it('should handle strings with no accents', () => {
    const input = 'Hello World';
    const expectedOutput = 'Hello World';

    expect(removeAccents(input)).toEqual(expectedOutput);
  });

  it('should handle empty string input', () => {
    const input = '';
    const expectedOutput = '';

    expect(removeAccents(input)).toEqual(expectedOutput);
  });

  it('should handle strings with multiple accents', () => {
    const input = 'Téstïñg Åccéñts';
    const expectedOutput = 'Testing Accents';

    expect(removeAccents(input)).toEqual(expectedOutput);
  });

  it('should handle strings with special characters', () => {
    const input = '!@#$%^&*()_+';
    const expectedOutput = '!@#$%^&*()_+';

    expect(removeAccents(input)).toEqual(expectedOutput);
  });
});
