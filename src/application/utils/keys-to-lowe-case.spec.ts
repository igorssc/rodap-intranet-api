import { describe, expect, it } from 'vitest';
import { keysToLowerCase } from './keys-to-lowe-case';

describe('keysToLowerCase function', () => {
  it('should convert keys of a simple object to lowercase', () => {
    const obj = { Name: 'John', Age: 30 };
    const result = keysToLowerCase(obj);

    expect(result).toEqual({ name: 'John', age: 30 });
  });

  it('should convert keys of a nested object to lowercase', () => {
    const obj = { Person: { Name: 'John', Age: 30 } };
    const result = keysToLowerCase(obj);

    expect(result).toEqual({ person: { name: 'John', age: 30 } });
  });

  it('should convert keys of an array of objects to lowercase', () => {
    const arr = [
      { Name: 'John', Age: 30 },
      { Name: 'Jane', Age: 25 },
    ];
    const result = keysToLowerCase(arr);

    expect(result).toEqual([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]);
  });

  it('should handle arrays of nested objects', () => {
    const arr = [
      { Person: { Name: 'John', Age: 30 } },
      { Person: { Name: 'Jane', Age: 25 } },
    ];
    const result = keysToLowerCase(arr);

    expect(result).toEqual([
      { person: { name: 'John', age: 30 } },
      { person: { name: 'Jane', age: 25 } },
    ]);
  });

  it('should handle null input', () => {
    const obj = null;
    const result = keysToLowerCase(obj);

    expect(result).toBeNull();
  });

  it('should handle non-object input', () => {
    const input = 'test';
    const result = keysToLowerCase(input);

    expect(result).toEqual('test');
  });
});
