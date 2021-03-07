import { Graphics, InteractionEvent } from 'pixi.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DrawFunc } from '../painter-types';

export const createRect: DrawFunc = (drawing$: Observable<InteractionEvent>, { line, fill }) => {
  const graphics = new Graphics();
  graphics.alpha = 0.3;

  let origin: { x: number; y: number };

  drawing$.pipe(map(e => ({ x: e.data.global.x, y: e.data.global.y }))).subscribe({
    next(position): void {
      if (!origin) {
        origin = position;
      }

      const { x, y } = position;
      const startX = x > origin.x ? origin.x : x;
      const startY = y > origin.y ? origin.y : y;
      const width = Math.abs(x - origin.x);
      const height = Math.abs(y - origin.y);

      graphics.clear();
      graphics.beginTextureFill(fill).lineTextureStyle(line).drawRect(startX, startY, width, height);
    },
    complete() {
      graphics.alpha = 1;
    },
  });

  return graphics;
};
