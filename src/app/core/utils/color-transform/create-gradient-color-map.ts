import { Rgb } from '@entities/color-type';

export const createGradientColorMap = (start: Rgb, end: Rgb): Rgb[] => {
  const rStep = (end[0] - start[0]) / 255;
  const gStep = (end[1] - start[1]) / 255;
  const bStep = (end[2] - start[2]) / 255;

  return new Array(256)
    .fill(0)
    .map((empty, i) => i)
    .map(i => {
      return [start[0] + rStep * i, start[1] + gStep * i, start[2] + bStep * i] as Rgb;
    });
};
