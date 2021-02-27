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
  BLEND_MODES,
} from 'pixi.js';
import { isNumber } from 'src/app/core/utils/assert/type-assert';
import { faPen, faEraser } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { map, pairwise, switchMap, takeUntil, startWith, tap, take } from 'rxjs/operators';

export interface PainterOptions {
  width?: number;
  height?: number;
}

enum DrawMode {
  Pen,
  Eraser,
}

interface StyleConfig {
  lineWidth?: number;
  texture?: number;
  fillStyle?: number;
  strokeStyle?: number;
  alpha?: number;
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

  drawMode: DrawMode = DrawMode.Pen;
  drawingLayer?: Container;
  drawingGraphics?: Graphics;

  drawOptions: StyleConfig = {
    lineWidth: 20,
    fillStyle: 0x000000,
    strokeStyle: 0x000000,
    alpha: 1,
  };

  eraserConfig: StyleConfig = {
    fillStyle: 0xffffff,
    strokeStyle: 0xffffff,
  };

  // Observable Event
  private pointerDown$ = new Subject<InteractionEvent>();
  private pointerMove$ = new Subject<InteractionEvent>();
  private pointerUp$ = new Subject<InteractionEvent>();
  drawingStart$ = this.pointerDown$.asObservable();
  drawing$ = this.pointerDown$.asObservable().pipe(
    switchMap(e =>
      this.pointerMove$.asObservable().pipe(
        startWith(e),
        map(e => ({ x: e.data.global.x, y: e.data.global.y })),
        pairwise(),
        takeUntil(
          this.pointerUp$.asObservable().pipe(
            tap(() => {
              this.initGraphics();
            })
          )
        )
      )
    )
  );

  DrawMode = DrawMode;
  icons = {
    faPen,
    faEraser,
  };

  @ViewChild('canvas') canvasEl?: ElementRef<HTMLCanvasElement>;

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

    this.drawingStart$.subscribe(() => {
      switch (this.drawMode) {
        case DrawMode.Pen:
          this.drawOptions.fillStyle = 0x000000;
          this.initGraphics();
          this.drawingGraphics!.blendMode = BLEND_MODES.NORMAL;
          break;

        case DrawMode.Eraser:
          this.drawOptions.fillStyle = 0xffffff;
          this.initGraphics();
          this.drawingGraphics!.blendMode = BLEND_MODES.XOR;
          break;
      }
    });

    this.drawing$.subscribe(e => {
      this.draw(e);
    });
  }

  draw(e: any): void {
    this.drawingGraphics?.moveTo(e[0].x, e[0].y)?.lineTo(e[1].x, e[1].y);
  }

  clearAll() {
    this.mainLayer?.removeChildren();
  }

  private initGraphics(config?: StyleConfig) {
    this.drawingLayer = new Container();
    this.drawingGraphics = new Graphics();
    this.drawingGraphics.beginTextureFill;
    this.drawingGraphics.lineTextureStyle({
      width: this.drawOptions.lineWidth,
      color: this.drawOptions.fillStyle,
      cap: LINE_CAP.ROUND,
      join: LINE_JOIN.ROUND,
    });
    this.drawingLayer.addChild(this.drawingGraphics);
    this.mainLayer.addChild(this.drawingLayer);
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
