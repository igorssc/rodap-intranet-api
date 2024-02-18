import { describe, expect, it } from 'vitest';
import { createSlug } from './create-slug';

describe('createSlug function', () => {
  it('should create a slug from a given text', () => {
    const input = 'Hello World! This is a Test 123';
    const expectedOutput = 'hello-world-this-is-a-test-123';

    expect(createSlug(input)).toBe(expectedOutput);
  });

  it('should handle empty string input', () => {
    const input = '';
    const expectedOutput = '';

    expect(createSlug(input)).toBe(expectedOutput);
  });

  it('should handle input with only special characters', () => {
    const input = '!@#$%^&*()_+';
    const expectedOutput = '';

    expect(createSlug(input)).toBe(expectedOutput);
  });

  it('should handle input with multiple spaces', () => {
    const input = '   multiple    spaces    ';
    const expectedOutput = 'multiple-spaces';

    expect(createSlug(input)).toBe(expectedOutput);
  });

  it('should handle input with leading and trailing spaces', () => {
    const input = '  leading and trailing spaces   ';
    const expectedOutput = 'leading-and-trailing-spaces';

    expect(createSlug(input)).toBe(expectedOutput);
  });
});
