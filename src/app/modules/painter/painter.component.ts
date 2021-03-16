import { Component, ChangeDetectionStrategy, Input, ViewChild, AfterViewInit } from '@angular/core';
import { faPen, faEraser } from '@fortawesome/free-solid-svg-icons';
import { createPen } from './draw-functions/pen';
import { hexToRgb } from '@utils/color-transform/hex-to-rgb';
import { rgbToHex } from '@utils/color-transform/rgb-to-hex';
import { Rgb } from '@entities/color-type';
import { createRect } from './draw-functions/rect';
import { PainterCanvasComponent } from './painter-canvas/painter-canvas.component';
import { createEraser } from './draw-functions/eraser';
import { PainterFillStyle, PainterLineStyle } from './painter-types';

export interface PainterOptions {
  width?: number;
  height?: number;
}

enum DrawType {
  Pen,
  Eraser,
  Rect,
}

const DrawFuncMap = {
  [DrawType.Pen]: createPen,
  [DrawType.Eraser]: createEraser,
  [DrawType.Rect]: createRect,
};

@Component({
  selector: 'app-painter',
  templateUrl: './painter.component.html',
  styleUrls: ['./painter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainterComponent implements AfterViewInit {
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
  readonly DrawFuncMap = DrawFuncMap;

  readonly icons = {
    faPen,
    faEraser,
  };

  @ViewChild(PainterCanvasComponent) canvas?: PainterCanvasComponent;

  ngAfterViewInit(): void {
    this.canvas?.drawingStart$.subscribe(drawing$ => {
      const newGraphics = DrawFuncMap[this.drawType](drawing$, { line: this.lineStyle, fill: this.fillStyle });
      this.canvas?.addChild(newGraphics);
    });
  }

  save(): string | undefined {
    if (this.canvas) {
      return this.canvas.canvasApp?.renderer.plugins.extract.base64(this.canvas.canvasApp.stage);
    }
    return;
  }
}
