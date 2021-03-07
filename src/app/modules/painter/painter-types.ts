import { Container, DisplayObject, FillStyle, InteractionEvent, LineStyle } from 'pixi.js';
import { Observable, Subscription } from 'rxjs';

export type PainterFillStyle = Partial<FillStyle>;
export type PainterLineStyle = Partial<LineStyle>;
export type Position = { x: number; y: number };

export interface DrawParams {
  line?: PainterLineStyle;
  fill?: PainterFillStyle;
}

export type DrawFunc = (drawing$: Observable<InteractionEvent>, params: DrawParams) => DisplayObject;
