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
    expect(applyInputPath(undefined)).toEqual(undefined);
    expect(applyInputPath(1)).toEqual(1);
    expect(applyInputPath('foobar')).toEqual('foobar');
    expect(applyInputPath([1, 2, 3])).toEqual([1, 2, 3]);
    expect(applyInputPath([])).toEqual([]);
  });
});
