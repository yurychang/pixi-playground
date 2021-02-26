import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Application, Container, Graphics, LineStyle, InteractionEvent, Sprite } from 'pixi.js';
import { isNumber } from 'src/app/core/utils/assert/type-assert';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject } from 'rxjs';

export interface PainterOptions {
  width?: number;
  height?: number;
}

enum DrawMode {
  Pen,
  circle,
}

@Component({
  selector: 'app-painter',
  templateUrl: './painter.component.html',
  styleUrls: ['./painter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainterComponent implements OnChanges, AfterViewInit {
  @Input() options: PainterOptions = {};

  canvasApp?: Application;
  bgSprite?: Sprite;

  drawMode: DrawMode = DrawMode.Pen;
  drawingLayer?: Container;
  drawingGraphic?: Graphics;

  drawOptions = {
    lineWidth: 4,
    fillStyle: 0x000000,
    strokeStyle: 0x000000,
  };

  isDrawing = false;
  drawingStart = new Subject<InteractionEvent>();
  drawing = new Subject<InteractionEvent>();

  icons = {
    faPen,
  };

  @ViewChild('canvas') canvasEl?: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!(changes.options && this.canvasApp)) return;

    if (changes.options) {
      const { width, height } = changes.options as PainterOptions;
      this.canvasApp!.renderer.resize(
        isNumber(width) ? (width as number) : this.canvasApp!.renderer.width,
        isNumber(height) ? (height as number) : this.canvasApp!.renderer.height
      );
    }
  }

  ngAfterViewInit(): void {
    this.initPixiApplication();

    this.drawingStart.subscribe(e => {
      this.drawingLayer = new Container();
      this.drawingGraphic = new Graphics();
      this.drawingGraphic.lineStyle(this.drawOptions.lineWidth, this.drawOptions.fillStyle);
      this.drawingGraphic.position.set(0, 0);
      this.drawingGraphic.moveTo(e.data.global.x, e.data.global.y);
      this.drawingLayer.addChild(this.drawingGraphic);
      this.canvasApp?.stage.addChild(this.drawingLayer);
    });

    this.drawing.subscribe(e => {
      if (this.drawMode === DrawMode.Pen) {
        this.drawLine(e);
      }
    });
  }

  drawLine(e: InteractionEvent): void {
    this.drawingGraphic?.lineTo(e.data.global.x, e.data.global.y);
  }

  clearAll() {
    this.canvasApp?.stage.removeChildren();
    this.canvasApp?.stage.addChild(this.bgSprite as Sprite);
  }

  private initPixiApplication(): void {
    this.canvasApp = new Application({
      view: this.canvasEl?.nativeElement,
      backgroundColor: 0xffffff,
      ...this.options,
    });

    this.canvasApp.stage.interactive = true;
    const bgSprite = new Sprite();
    bgSprite.width = this.canvasApp.renderer.width;
    bgSprite.height = this.canvasApp.renderer.height;
    this.canvasApp.stage.addChild(bgSprite);
    this.bgSprite = bgSprite;

    this.canvasApp.stage.on('pointerdown', (e: InteractionEvent) => {
      this.isDrawing = true;
      this.drawingStart.next(e);
    });

    this.canvasApp.stage.on('pointermove', (e: InteractionEvent) => {
      if (this.isDrawing) {
        this.drawing.next(e);
      }
    });

    this.canvasApp.stage.on('pointerup', (e: InteractionEvent) => {
      this.isDrawing = false;
    });
    this.canvasApp.stage.on('pointerleave', (e: InteractionEvent) => {
      this.isDrawing = false;
    });
  }
}
