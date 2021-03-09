import { isNumber } from './type-assert';

describe('isNumber function', () => {
  it('should return true', () => {
    expect(isNumber(10)).toBeTrue();
  });

  it('should return false', () => {
    expect(isNumber('10')).toBeFalse();
    expect(isNumber('abc')).toBeFalse();
    expect(isNumber({})).toBeFalse();
    expect(isNumber([])).toBeFalse();
  });
});
