import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { faPen, faEraser } from '@fortawesome/free-solid-svg-icons';
import { createEraser, createPen } from './draw-function/pen';
import { hexToRgb } from '@utils/color-transform/hex-to-rgb';
import { rgbToHex } from '@utils/color-transform/rgb-to-hex';
import { Rgb } from '@entities/color-type';
import { createRect } from './draw-function/rect';
import {
  PAINTER_DRAW_FUNC_CONFIG,
  drawFuncConfig,
  PainterFillStyle,
  PainterLineStyle,
} from './painter-canvas/painter-canvas.component';

export interface PainterOptions {
  width?: number;
  height?: number;
}

enum DrawType {
  Pen,
  Eraser,
  Rect,
}

@Component({
  selector: 'app-painter',
  templateUrl: './painter.component.html',
  styleUrls: ['./painter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PAINTER_DRAW_FUNC_CONFIG,
      useValue: [
        {
          type: DrawType.Pen,
          factory: createPen,
        },
        {
          type: DrawType.Eraser,
          factory: createEraser,
        },
        {
          type: DrawType.Rect,
          factory: createRect,
        },
      ] as drawFuncConfig,
    },
  ],
})
export class PainterComponent {
  @Input() options: PainterOptions = {};

  get fillColor(): string {
    return this._fillColor;
  }
  set fillColor(v: string) {
    this._fillColor = v;
    const [r, g, b] = hexToRgb(v) as Rgb;
    this.fillStyle.color = rgbToHex(r, g, b, true) as number;
  }
  private _fillColor = '#ffffff';

  get lineColor(): string {
    return this._lineColor;
  }
  set lineColor(v: string) {
    this._lineColor = v;
    const [r, g, b] = hexToRgb(v) as Rgb;
    this.lineStyle.color = rgbToHex(r, g, b, true) as number;
  }
  private _lineColor = '#000000';

  fillStyle: PainterFillStyle = {
    color: 0xffffff,
    alpha: 1,
  };

  lineStyle: PainterLineStyle = {
    width: 1,
    color: 0x000000,
    alpha: 1,
  };

  drawType: DrawType = DrawType.Pen;

  readonly DrawType = DrawType;

  readonly icons = {
    faPen,
    faEraser,
  };
}
