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
  Texture,
  Matrix,
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

interface FillStyle {
  color?: number;
  alpha?: number;
  texture?: Texture;
}

interface StrokeStyle {
  width?: number;
  color?: number;
  alpha?: number;
  cap?: LINE_CAP;
  join?: LINE_JOIN;
  texture?: Texture;
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
  drawingGraphics?: Graphics;

  fillStyle: FillStyle = {
    color: 0x000000,
    alpha: 1,
  };

  strokeStyle: StrokeStyle = {
    width: 1,
    color: 0x000000,
    alpha: 1,
    cap: LINE_CAP.ROUND,
    join: LINE_JOIN.ROUND,
  };

  eraserStyle: StrokeStyle = {
    color: 0xffffff,
  };

  private pointerDown$ = new Subject<InteractionEvent>();
  private pointerMove$ = new Subject<InteractionEvent>();
  private pointerUp$ = new Subject<InteractionEvent>();
  drawingStart$ = this.pointerDown$.asObservable();
  drawing$ = this.pointerDown$.asObservable().pipe(
    switchMap(e =>
      this.pointerMove$.asObservable().pipe(
        startWith(e),
        // tslint:disable-next-line: no-shadowed-variable
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
    this.initGraphics();

    this.drawingStart$.subscribe(() => {
      this.initGraphics();

      switch (this.drawMode) {
        case DrawMode.Eraser:
          this.drawingGraphics!.blendMode = BLEND_MODES.XOR;
          this.drawingGraphics?.lineTextureStyle({ ...this.strokeStyle, ...this.eraserStyle });
          break;
      }

      console.log(this.strokeStyle.width);
    });

    this.drawing$.subscribe(e => {
      this.draw(e);
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
    this.drawingGraphics.lineTextureStyle(this.strokeStyle);
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
