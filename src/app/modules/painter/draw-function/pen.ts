import { BLEND_MODES } from 'pixi.js';
import { DrawFuncFactory } from '../painter-canvas/painter-canvas.component';

export const createPen: DrawFuncFactory = graphics => {
  return {
    draw(from: { x: number; y: number }, to: { x: number; y: number }) {
      graphics.moveTo(from.x, from.y).lineTo(to.x, to.y);
    },
  };
};

export const createEraser: DrawFuncFactory = (graphics, styles) => {
  graphics.blendMode = BLEND_MODES.XOR;
  graphics.lineTextureStyle({ ...styles.line, color: 0xffffff });

  return {
    draw(from: { x: number; y: number }, to: { x: number; y: number }) {
      graphics.moveTo(from.x, from.y).lineTo(to.x, to.y);
    },
  };
};
