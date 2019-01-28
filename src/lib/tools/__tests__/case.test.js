const { pascalCaseToCamelCase } = require('../case');

describe('Case', () => {
  it('should leave an empty object unchanged', () => {
    const original = {};
    const expected = original;

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should leave an object already in camelCase unchanged', () => {
    const original = { foo: 'bar', camelCase: 'unchanged' };
    const expected = original;

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should change a single PascalCase key to camelCase', () => {
    const original = { One: 'Foo' };
    const expected = { one: 'Foo' };

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should change multiple PascalCase keys to camelCase', () => {
    const original = { One: 'Foo', two: 'bar', ThreeFourFive: 'Baz' };
    const expected = { one: 'Foo', two: 'bar', threeFourFive: 'Baz' };

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should change PascalCase keys nested down one level to camelCase', () => {
    const original = { One: { TwoThree: 'foo', unchanged: [1, 2, 3] } };
    const expected = { one: { twoThree: 'foo', unchanged: [1, 2, 3] } };

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should change PascalCase nested down multiple levels to camelCase', () => {
    // eslint-disable-next-line max-len
    const original = { One: { TwoThree: { MoreNestingHere: true, stuff: 45, GoDeeeeper: {} }, unchanged: [1, 2, 3] } };
    // eslint-disable-next-line max-len
    const expected = { one: { twoThree: { moreNestingHere: true, stuff: 45, goDeeeeper: {} }, unchanged: [1, 2, 3] } };

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should leave arrays with no nested objects unchanged', () => {
    const original = [1, 2, 3, 'four', 'FiveSix'];
    const expected = original;

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should change arrays with nested objects from PascalCase to camelCase', () => {
    const original = [{ One: 2, ThreeFour: 5 }, { six: 7, Eight: 9 }];
    const expected = [{ one: 2, threeFour: 5 }, { six: 7, eight: 9 }];

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should leave strings unchanged', () => {
    const original = 'SomeString';
    const expected = original;

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should leave numbers unchanged', () => {
    const original = 25;
    const expected = original;

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });

  it('should leave booleans unchanged', () => {
    const original = 25;
    const expected = original;

    const actual = pascalCaseToCamelCase(original);
    expect(actual).toEqual(expected);
  });
});
