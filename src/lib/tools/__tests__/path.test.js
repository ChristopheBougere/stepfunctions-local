const {
  applyInputPath,
  applyOutputPath,
  applyResultPath,
} = require('../path');

describe('Path', () => {
  it('should apply input + output path', () => {
    const inputPath = '$.foo';
    const outputPath = '$.john';
    const object = {
      foo: 'bar',
      john: 'doe',
    };
    expect(applyInputPath(object, inputPath)).toEqual('bar');
    expect(applyOutputPath(object, outputPath)).toEqual('doe');
  });

  it('should apply result path', () => {
    const resultPath = '$.a.great.result.path';
    const value = 'value';
    const object = {
      foo: 'bar',
    };
    expect(applyResultPath(object, resultPath, value)).toMatchObject({
      foo: 'bar',
      a: {
        great: {
          result: {
            path: 'value',
          },
        },
      },
    });
  });

  it('should apply pass through non-objects untouched', () => {
    expect(applyInputPath(undefined)).toBe(undefined);
    expect(applyInputPath(1)).toBe(1);
    expect(applyInputPath('foobar')).toBe('foobar');
    expect(applyInputPath([1,2,3])).toBe([1,2,3]);
    expect(applyInputPath([])).toBe([]);
  });
});
