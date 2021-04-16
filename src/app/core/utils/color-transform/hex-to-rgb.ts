import { Rgb } from '@entities/color-type';

export const hexToRgb = (hex: string): Rgb | undefined => {
  hex = hex.slice(1);

  let r: string;
  let g: string;
  let b: string;

  if (hex.length === 3) {
    r = hex[0] + hex[0];
    g = hex[1] + hex[1];
    b = hex[2] + hex[2];
  } else if (hex.length === 6) {
    r = hex[0] + hex[1];
    g = hex[2] + hex[3];
    b = hex[4] + hex[5];
  } else {
    return;
  }

  return [Number.parseInt(r, 16), Number.parseInt(g, 16), Number.parseInt(b, 16)];
};
