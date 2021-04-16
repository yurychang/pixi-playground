import { createGradientColorMap } from './create-gradient-color-map';
import { hexToRgb } from './hex-to-rgb';
import { rgbToHex } from './rgb-to-hex';

describe('Hex to rgb', () => {
  it('should return correct rgb code', () => {
    expect(hexToRgb('#ff9800')).toEqual([255, 152, 0]);
    expect(hexToRgb('#a5f')).toEqual([170, 85, 255]);
  });

  it('should return falsy', () => {
    expect(hexToRgb('ff9800')).toBeFalsy();
    expect(hexToRgb('f90')).toBeFalsy();
  });
});

describe('Rgb to Hex', () => {
  it('should return correct six digits hex code', () => {
    expect(rgbToHex(255, 152, 0)).toBe('#ff9800');
    expect(rgbToHex(170, 85, 255)).toBe('#aa55ff');
  });
  it('should return hexadecimal', () => {
    expect(rgbToHex(255, 152, 0, true)).toBe(16750592);
    expect(rgbToHex(170, 85, 255, true)).toBe(11163135);
  });
});

describe('Create gradient color map', () => {
  it('should return length equal to step', () => {
    const step = 10;
    expect(createGradientColorMap([255, 255, 255], [0, 0, 0], step)).toHaveSize(step);
  });

  it('should return correct gradient value', () => {
    expect(createGradientColorMap([255, 255, 255], [0, 0, 0], 5)).toEqual([
      [255, 255, 255],
      [191, 191, 191],
      [127, 127, 127],
      [63, 63, 63],
      [0, 0, 0],
    ]);
  });
});
