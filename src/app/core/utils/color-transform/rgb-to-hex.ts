export const rgbToHex = (r: number, g: number, b: number, useNum = false): string | number => {
  if (useNum) {
    // return r * Math.pow(16, 4) + g * Math.pow(16, 2) + b;
    return Number.parseInt(`0x${r.toString(16)}${g.toString(16)}${b.toString(16)}`, 16);
  } else {
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  }
};
