import { Component, ViewChild, ElementRef, AfterViewInit, Input, NgZone, OnChanges } from '@angular/core';
import {
  Application,
  Container,
  Graphics,
  InteractionEvent,
  Sprite,
  LINE_CAP,
  LINE_JOIN,
  DisplayObject,
} from 'pixi.js';
import { Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { PainterFillStyle, PainterLineStyle } from '../painter-types';

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

  readonly drawingStart$ = this.pointerDown$.asObservable().pipe(
    tap(e => {
      this.pointerMove$ = new Subject<InteractionEvent>();
    }),
    map(e => this.pointerMove$.asObservable().pipe(startWith(e)))
  );

  @ViewChild('canvas') canvasEl?: ElementRef<HTMLCanvasElement>;

  constructor(private zone: NgZone) {}

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
  }

  addChild<TChildren extends DisplayObject[]>(...children: TChildren): void {
    this.mainLayer.addChild(...children);
  }

  clear(): void {
    this.mainLayer?.removeChildren();
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
        this.pointerMove$.complete();
      });

      this.canvasApp.stage.on('mouseout', (e: InteractionEvent) => {
        this.pointerMove$.complete();
      });
    });
  }
}
