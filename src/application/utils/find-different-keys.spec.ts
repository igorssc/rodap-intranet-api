import { describe, expect, it } from 'vitest';
import { findDifferentKeys } from './find-different-keys';

describe('findDifferentKeys function', () => {
  it('should find different keys between two objects', () => {
    const baseObj = { a: 1, b: 2, c: 3 };
    const compareObj = { a: 1, b: 5, d: 4 };
    const expectedOutput = ['b', 'd'];

    expect(findDifferentKeys(baseObj, compareObj)).toEqual(expectedOutput);
  });

  it('should not ignore empty keys by default', () => {
    const baseObj = { a: 1, b: null, c: undefined };
    const compareObj = { a: 1, b: 2, c: 3 };
    const expectedOutput = ['b', 'c'];

    expect(findDifferentKeys(baseObj, compareObj)).toEqual(expectedOutput);
  });

  it('should consider empty keys if specified', () => {
    const baseObj = { a: 1, b: null, c: undefined };
    const compareObj = { a: 1, b: 2, c: 3 };
    const expectedOutput = ['b', 'c'];

    expect(findDifferentKeys(baseObj, compareObj, false)).toEqual(
      expectedOutput,
    );
  });

  it('should not manipulate objects with nested objects', () => {
    const baseObj = { a: { b: 1, c: 2 }, d: 3 };
    const compareObj = { a: { b: 1, c: 5 }, d: 4 };
    const expectedOutput = ['d'];

    expect(findDifferentKeys(baseObj, compareObj)).toEqual(expectedOutput);
  });
});
