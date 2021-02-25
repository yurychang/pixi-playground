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
import { Application, Container, Graphics } from 'pixi.js';
import { isNumber } from 'src/app/core/utils/assert/type-assert';

export interface PainterOptions {
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-painter',
  templateUrl: './painter.component.html',
  styleUrls: ['./painter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainterComponent implements OnChanges, AfterViewInit {
  @Input() options: PainterOptions = {};

  @ViewChild('canvas') canvasEl?: ElementRef<HTMLCanvasElement>;

  canvasApp?: Application;

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
  }

  private initPixiApplication(): void {
    this.canvasApp = new Application({
      view: this.canvasEl?.nativeElement,
      backgroundColor: 0xffffff,
      ...this.options,
    });
  }
}
