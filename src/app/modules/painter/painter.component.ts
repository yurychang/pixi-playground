import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  NgZone,
} from '@angular/core';
import {
  Application,
  Container,
  Graphics,
  LineStyle,
  InteractionEvent,
  Sprite,
  LINE_CAP,
  LINE_JOIN,
  FillStyle,
} from 'pixi.js';
import { isNumber } from 'src/app/core/utils/assert/type-assert';
import { faPen, faEraser } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { map, pairwise, switchMap, takeUntil, startWith, tap, take } from 'rxjs/operators';
import { createEraser, createPen } from './draw-function/pen';

export interface PainterOptions {
  width?: number;
  height?: number;
}

export type PainterFillStyle = Partial<FillStyle>;
export type PainterLineStyle = Partial<LineStyle>;
export type Position = { x: number; y: number };

export type DrawFuncFactory = (
  g: Graphics,
  styles: { fill: PainterFillStyle; line: PainterLineStyle }
) => {
  setUp?: () => void;
  draw?: (from: Position, to: Position) => void;
  complete?: (e: InteractionEvent) => void;
};

enum DrawType {
  Pen,
  Eraser,
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
  backgroundSprite = new Sprite();
  mainLayer = new Container();

  drawType: DrawType = DrawType.Pen;
  drawingGraphics?: Graphics;

  fillStyle: PainterFillStyle = {
    color: 0x000000,
    alpha: 1,
  };

  lineStyle: PainterLineStyle = {
    width: 1,
    color: 0x000000,
    alpha: 1,
    cap: LINE_CAP.ROUND,
    join: LINE_JOIN.ROUND,
  };

  eraserStyle: PainterLineStyle = {
    color: 0xffffff,
  };

  private pointerDown$ = new Subject<InteractionEvent>();
  private pointerMove$ = new Subject<InteractionEvent>();
  private pointerUp$ = new Subject<InteractionEvent>();
  drawingStart$ = this.pointerDown$.asObservable();
  drawingEnd$ = new Subject<InteractionEvent>();
  drawing$ = this.pointerDown$.asObservable().pipe(
    switchMap(e =>
      this.pointerMove$.asObservable().pipe(
        startWith(e),
        takeUntil(
          this.pointerUp$.asObservable().pipe(
            tap(e => {
              this.initGraphics();
              this.drawingEnd$.next(e);
            })
          )
        ),
        map(e => ({ x: e.data.global.x, y: e.data.global.y })),
        pairwise()
      )
    )
  );

  DrawType = DrawType;
  icons = {
    faPen,
    faEraser,
  };

  @ViewChild('canvas') canvasEl?: ElementRef<HTMLCanvasElement>;

  private drawFactorys = [
    {
      type: DrawType.Pen,
      factory: createPen,
    },
    {
      type: DrawType.Eraser,
      factory: createEraser,
    },
  ];

  constructor(private zone: NgZone) {}

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

    let drawFactory;
    let startFunc: (() => void) | undefined;
    let drawFunc: Function | undefined;
    let completeFunc: ((e: InteractionEvent) => void) | undefined;

    this.drawingStart$.subscribe(() => {
      this.initGraphics();

      drawFactory = this.drawFactorys.find(({ type }) => type === this.drawType)?.factory;
      if (drawFactory) {
        const { setUp, draw, complete } = drawFactory?.(this.drawingGraphics as Graphics, {
          fill: this.fillStyle,
          line: this.lineStyle,
        });
        startFunc = setUp;
        drawFunc = draw;
        completeFunc = complete;
      }
      startFunc?.();
    });

    this.drawing$.subscribe(e => {
      drawFunc?.(...e);
    });

    this.drawingEnd$.subscribe(e => {
      completeFunc?.(e);
    });
  }

  draw(e: any): void {
    this.drawingGraphics?.moveTo(e[0].x, e[0].y)?.lineTo(e[1].x, e[1].y);
  }

  clearAll(): void {
    this.mainLayer?.removeChildren();
  }

  private initGraphics(): void {
    this.drawingGraphics = new Graphics();
    this.drawingGraphics.lineTextureStyle(this.lineStyle);
    this.drawingGraphics.beginTextureFill(this.fillStyle);
    this.mainLayer.addChild(this.drawingGraphics);
  }

  private initPixiApplication(): void {
    this.zone.runOutsideAngular(() => {
      this.canvasApp = new Application({
        view: this.canvasEl?.nativeElement,
        transparent: true,
        ...this.options,
      });

      this.canvasApp.stage.interactive = true;
      this.backgroundSprite.width = this.canvasApp.renderer.width;
      this.backgroundSprite.height = this.canvasApp.renderer.height;
      this.canvasApp.stage.addChild(this.backgroundSprite);
      this.canvasApp.stage.addChild(this.mainLayer);

      this.canvasApp.stage.on('pointerdown', (e: InteractionEvent) => {
        this.pointerDown$.next(e);
      });

      this.canvasApp.stage.on('pointermove', (e: InteractionEvent) => {
        this.pointerMove$.next(e);
      });

      this.canvasApp.stage.on('pointerup', (e: InteractionEvent) => {
        this.pointerUp$.next();
      });

      this.canvasApp.stage.on('mouseout', (e: InteractionEvent) => {
        this.pointerUp$.next();
      });
    });
  }
}
