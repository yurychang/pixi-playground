import { Rgb } from '@entities/color-type';

export const createGradientColorMap = (start: Rgb, end: Rgb, step = 256): Rgb[] => {
  const rStep = (end[0] - start[0]) / (step - 1);
  const gStep = (end[1] - start[1]) / (step - 1);
  const bStep = (end[2] - start[2]) / (step - 1);

  return new Array(step).fill(0).map((empty, i) => {
    return [start[0] + rStep * i, start[1] + gStep * i, start[2] + bStep * i].map(num => Math.floor(num)) as Rgb;
  });
};
