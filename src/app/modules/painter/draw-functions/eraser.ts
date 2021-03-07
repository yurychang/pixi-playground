import { BLEND_MODES, Graphics, InteractionEvent, LINE_CAP, LINE_JOIN } from 'pixi.js';
import { Observable } from 'rxjs';
import { map, pairwise } from 'rxjs/operators';
import { DrawFunc } from '../painter-types';

export const createEraser: DrawFunc = (drawing$: Observable<InteractionEvent>, { line }) => {
  const graphics = new Graphics();
  graphics.blendMode = BLEND_MODES.DST_OUT;
  graphics.lineTextureStyle({ ...line, color: 0xffffff, cap: LINE_CAP.ROUND, join: LINE_JOIN.ROUND });

  drawing$
    .pipe(
      map(e => ({ x: e.data.global.x, y: e.data.global.y })),
      pairwise()
    )
    .subscribe({
      next(pairPosition): void {
        const [from, to] = pairPosition;
        graphics.moveTo(from.x, from.y).lineTo(to.x, to.y);
      },
    });

  return graphics;
};
