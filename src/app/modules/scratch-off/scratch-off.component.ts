import { Component, OnInit, ViewChild, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Graphics, Loader, Matrix, Texture } from 'pixi.js';
import { createEraser } from '../painter/draw-functions/eraser';
import { PainterCanvasComponent } from '../painter/painter-canvas/painter-canvas.component';

const brushPath = '../../../assets/brushes/brush_stroke.svg';

@Component({
  selector: 'app-scratch-off',
  templateUrl: './scratch-off.component.html',
  styleUrls: ['./scratch-off.component.scss'],
})
export class ScratchOffComponent implements OnInit, AfterViewInit {
  @Input() width = 400;
  @Input() height = 400;
  @Input() brushWidth = 50;
  @Input() sensingRange = 50;

  scratchState = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];

  scratchPoints?: { x: number; y: number }[][] = [];

  brush?: Texture;

  @ViewChild(PainterCanvasComponent) canvas?: PainterCanvasComponent;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    const oneThirdW = this.width / 3;
    const oneThirdH = this.height / 3;

    for (let i = 0; i < 3; i++) {
      const newRow = [];
      for (let j = 0; j < 3; j++) {
        newRow?.push({ x: oneThirdW * j + oneThirdW / 2, y: oneThirdH * i + oneThirdH / 2 });
      }
      this.scratchPoints?.push(newRow);
    }

    Loader.shared.add('scratch', brushPath).load((loader, resources) => {
      this.brush = resources.scratch?.texture;
    });
  }

  ngAfterViewInit(): void {
    const graphics = new Graphics();
    graphics.beginFill(0x12c21c);
    graphics.drawRect(0, 0, this.width, this.height);

    this.canvas!.mainLayer.addChild(graphics);

    this.canvas!.drawingStart$.subscribe(drawing$ => {
      const eraser = createEraser(drawing$, {
        line: { width: this.brushWidth, texture: this.brush, matrix: new Matrix(1, 0, 0, 1) },
      });
      this.canvas?.addChild(eraser);

      drawing$.subscribe(e => {
        const { x, y } = e.data.global;
        this.detectScratch(x, y);
      });
    });
  }

  detectScratch(x: number, y: number): void {
    this.scratchPoints?.forEach((ary, i) => {
      ary.forEach(({ x: px, y: py }, j) => {
        const distance = Math.hypot(Math.abs(x - px), Math.abs(y - py));
        if (distance <= this.sensingRange / 2) {
          this.scratchState[i][j] = true;
        }
      });
    });
    this.cd.detectChanges();
  }
}
