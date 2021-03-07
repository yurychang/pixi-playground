import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Graphics } from 'pixi.js';
import { createEraser } from '../painter/draw-functions/eraser';
import { PainterCanvasComponent } from '../painter/painter-canvas/painter-canvas.component';

@Component({
  selector: 'app-scratch-off',
  templateUrl: './scratch-off.component.html',
  styleUrls: ['./scratch-off.component.scss'],
})
export class ScratchOffComponent implements OnInit {
  @Input() width = 400;
  @Input() height = 400;

  @Input() penWidth = 60;

  @ViewChild(PainterCanvasComponent) canvas?: PainterCanvasComponent;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const graphics = new Graphics();
    graphics.beginFill(0x12c21c);
    graphics.drawRect(0, 0, this.width, this.height);

    this.canvas!.mainLayer.addChild(graphics);

    this.canvas!.drawingStart$.subscribe(drawing$ => {
      const eraser = createEraser(drawing$, { line: { width: this.penWidth } });
      this.canvas?.addChild(eraser);
    });
  }
}
