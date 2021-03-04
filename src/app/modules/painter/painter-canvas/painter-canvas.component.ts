import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  NgZone,
  OnChanges,
  InjectionToken,
  Inject,
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
import { Subject } from 'rxjs';
import { map, pairwise, switchMap, takeUntil, startWith, tap } from 'rxjs/operators';

export type PainterFillStyle = Partial<FillStyle>;
export type PainterLineStyle = Partial<LineStyle>;
export type Position = { x: number; y: number };

export type DrawFuncFactory = (
  g: Graphics,
  styles: { fill: PainterFillStyle; line: PainterLineStyle },
  app: Application
) => {
  setUp?: (e: InteractionEvent) => void;
  draw?: (from: Position, to: Position) => void;
  complete?: (e: InteractionEvent) => void;
};

export type drawFuncConfig = {
  type: any;
  factory: DrawFuncFactory;
}[];

export const PAINTER_DRAW_FUNC_CONFIG = new InjectionToken<drawFuncConfig>('painter_draw_func_config');

@Component({
  selector: 'app-painter-canvas',
  templateUrl: './painter-canvas.component.html',
  styleUrls: ['./painter-canvas.component.scss'],
})
export class PainterCanvasComponent implements OnChanges, AfterViewInit {
  @Input() width = 400;
  @Input() height = 400;
  @Input() fillStyle: PainterFillStyle = {};
  @Input() lineStyle: PainterLineStyle = {};
  @Input() drawType: any;

  canvasApp?: Application;
  backgroundSprite = new Sprite();
  mainLayer = new Container();
  drawingGraphics?: Graphics;

  readonly defaultFill: PainterFillStyle = {
    color: 0x000000,
    alpha: 1,
  };

  readonly defaultLine: PainterLineStyle = {
    width: 1,
    color: 0x000000,
    alpha: 1,
    cap: LINE_CAP.ROUND,
    join: LINE_JOIN.ROUND,
  };

  private pointerDown$ = new Subject<InteractionEvent>();
  private pointerMove$ = new Subject<InteractionEvent>();
  private pointerUp$ = new Subject<InteractionEvent>();

  readonly drawingStart$ = this.pointerDown$.asObservable();
  readonly drawingEnd$ = new Subject<InteractionEvent>();
  readonly drawing$ = this.pointerDown$.asObservable().pipe(
    switchMap(e =>
      this.pointerMove$.asObservable().pipe(
        startWith(e),
        takeUntil(
          this.pointerUp$.asObservable().pipe(
            tap(e => {
              this.drawingEnd$.next(e);
            })
          )
        ),
        map(e => ({ x: e.data.global.x, y: e.data.global.y })),
        pairwise()
      )
    )
  );

  @ViewChild('canvas') canvasEl?: ElementRef<HTMLCanvasElement>;

  constructor(@Inject(PAINTER_DRAW_FUNC_CONFIG) private drawFuncFactory: drawFuncConfig, private zone: NgZone) {}

  ngOnChanges(changes: { width?: number; height?: number }): void {
    if (this.canvasApp && changes) {
      const { width, height } = changes;
      this.canvasApp.renderer.resize(
        width ? width : this.canvasApp.renderer.width,
        height ? height : this.canvasApp.renderer.height
      );
    }
  }

  ngAfterViewInit(): void {
    this.initCanvasApp();

    let drawFactory;
    let startFunc: Function | undefined;
    let drawFunc: Function | undefined;
    let completeFunc: Function | undefined;

    this.drawingStart$.subscribe((e: InteractionEvent) => {
      const fillStyle = {
        ...this.defaultFill,
        ...this.fillStyle,
      };
      const lineStyle = {
        ...this.defaultLine,
        ...this.lineStyle,
      };

      this.initGraphics(fillStyle, lineStyle);

      drawFactory = this.drawFuncFactory.find(({ type }) => type === this.drawType)?.factory;
      if (drawFactory) {
        const { setUp, draw, complete } = drawFactory?.(
          this.drawingGraphics as Graphics,
          {
            fill: fillStyle,
            line: lineStyle,
          },
          this.canvasApp as Application
        );
        startFunc = setUp;
        drawFunc = draw;
        completeFunc = complete;
      }
      startFunc?.(e);
    });

    this.drawing$.subscribe(e => {
      drawFunc?.(...e);
    });

    this.drawingEnd$.subscribe(e => {
      completeFunc?.(e);
    });
  }

  clear(): void {
    this.mainLayer?.removeChildren();
  }

  private initGraphics(fillStyle: PainterFillStyle, lineStyle: PainterLineStyle): void {
    this.drawingGraphics = new Graphics();
    this.drawingGraphics.lineTextureStyle(lineStyle);
    this.drawingGraphics.beginTextureFill(fillStyle);
    this.mainLayer.addChild(this.drawingGraphics);
  }

  private initCanvasApp(): void {
    this.zone.runOutsideAngular(() => {
      this.canvasApp = new Application({
        view: this.canvasEl?.nativeElement,
        transparent: true,
        width: this.width,
        height: this.height,
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
