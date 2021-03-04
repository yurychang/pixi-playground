import { DrawFuncFactory } from '../painter-canvas/painter-canvas.component';

export const createRect: DrawFuncFactory = (graphics, styles) => {
  const origin: { x: number; y: number } = { x: 0, y: 0 };

  return {
    setUp(e) {
      origin.x = e.data.global.x;
      origin.y = e.data.global.y;
      graphics.alpha = 0.3;
    },
    draw(from: { x: number; y: number }, to: { x: number; y: number }) {
      const { x, y } = to;
      const startX = x > origin.x ? origin.x : x;
      const startY = y > origin.y ? origin.y : y;
      const width = Math.abs(x - origin.x);
      const height = Math.abs(y - origin.y);

      graphics.clear();
      graphics.beginTextureFill(styles.fill).lineTextureStyle(styles.line).drawRect(startX, startY, width, height);
    },
    complete(e) {
      graphics.alpha = 1;
    },
  };
};
