import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Rgb } from '@entities/color-type';
import { createGradientColorMap } from '@utils/color-transform/create-gradient-color-map';
import { hexToRgb } from '@utils/color-transform/hex-to-rgb';
import { rgbToHex } from '@utils/color-transform/rgb-to-hex';
import { Application, BLEND_MODES, Graphics, Sprite } from 'pixi.js';
import { interval, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent implements OnInit {
  @Input()
  get color(): string | Rgb {
    return this._color;
  }
  set color(color: string | Rgb) {
    this._color = color;

    const rgbColor = typeof color === 'string' || color instanceof String ? hexToRgb(color as string) : color;

    if (rgbColor) {
      this.rgbColor = rgbColor;

      const max = Math.max(this.rgbColor[0], this.rgbColor[1], this.rgbColor[2]);
      const rate = 255 / max;
      this.mainColor = this.rgbColor.map(color => (color === max ? color : color * rate)) as Rgb;
    }

    this.colorChange.emit(color);
  }
  private _color: string | Rgb = '#ffffff';

  @Output() colorChange = new EventEmitter<string | Rgb>();

  colorPicker?: Application;

  mouseMove$ = new Subject<MouseEvent>();
  mouseUpOrLeave$ = new Subject<MouseEvent>();
  mainColorPickerDown$ = new Subject<MouseEvent>();
  mainColorPickerMoving$ = this.mainColorPickerDown$
    .asObservable()
    .pipe(switchMap(e => this.mouseMove$.asObservable().pipe(startWith(e), takeUntil(this.mouseUpOrLeave$))));

  @ViewChild('colorPicker') colorPickerRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mainColorTracker') mainColorTracker?: ElementRef<HTMLCanvasElement>;

  get mainColor(): Rgb {
    return this._mainColor;
  }

  set mainColor(color: Rgb) {
    this._mainColor = color;

    const oneSixth = 100 / 6;
    const oneThird = 100 / 3;
    const twoThird = 200 / 3;

    const [r, g, b] = color;
    if (r !== 0 && b !== 0) {
      if (r === b) {
        this.mainColorThumbX = 50 * oneSixth;
      } else if (r > b) {
        this.mainColorThumbX = (b / 256) * oneSixth;
      } else {
        this.mainColorThumbX = ((256 - r) / 256) * oneSixth + oneSixth;
      }
    } else if (b !== 0 && g !== 0) {
      if (b === g) {
        this.mainColorThumbX = 50 * oneSixth + oneThird;
      } else if (b > g) {
        this.mainColorThumbX = (g / 256) * oneSixth + oneThird;
      } else {
        this.mainColorThumbX = ((256 - b) / 256) * oneSixth + oneThird + oneSixth;
      }
    } else if (r !== 0 && g !== 0) {
      if (r === g) {
        this.mainColorThumbX = 50 * oneSixth + twoThird;
      } else if (g > r) {
        this.mainColorThumbX = (r / 256) * oneSixth + twoThird;
      } else {
        this.mainColorThumbX = ((256 - g) / 256) * oneSixth + twoThird + oneSixth;
      }
    }
  }

  private _mainColor: Rgb = [255, 0, 0];

  private rgbColor: Rgb = [255, 255, 255];

  mainColorThumbX = 0; // % unit;

  constructor() {}

  ngAfterViewInit(): void {
    this.initColorPicker();
    this.initMainColorSlider();

    this.mainColorPickerMoving$.subscribe(e => {
      const { left, width } = this.mainColorTracker?.nativeElement.getBoundingClientRect() as DOMRect;
      let { x: pointerX } = e;
      pointerX -= left;
      pointerX = pointerX <= 0 ? 0 : pointerX >= width ? width : pointerX;

      this.mainColor = this.getMainColorFromPosition(pointerX, width);
    });
  }

  ngOnInit(): void {}

  private initColorPicker() {
    const width = 200;
    const height = 100;

    this.colorPicker = new Application({
      view: this.colorPickerRef?.nativeElement,
      width,
      height,
      backgroundColor: 0xffffff,
      transparent: true,
    });

    const pickerBg = new Graphics();

    const step = 256;
    const blockWidth = width / step;
    const blockHeight = height / step;
    let blockY = 0;

    const startGradient = createGradientColorMap([255, 255, 255], [0, 0, 0], step);
    const endGradient = createGradientColorMap(this.mainColor, [0, 0, 0], step);

    startGradient.forEach((startColor, i) => {
      let blockX = 0;
      createGradientColorMap(startColor, endGradient[i], step).forEach((color, j) => {
        const hex = rgbToHex(color[0], color[1], color[2], true) as number;
        pickerBg.beginFill(hex);
        pickerBg.drawRect(blockX, blockY, blockWidth, blockHeight);
        blockX += blockWidth;
      });
      blockY += blockHeight;
    });

    this.colorPicker.stage.addChild(pickerBg);
  }

  private initMainColorSlider() {
    const width = 120;
    const height = 12;

    const mainColorTracker = new Application({
      view: this.mainColorTracker?.nativeElement,
      width,
      height,
      transparent: true,
    });

    const step = 256;
    const redToBlueInterval = [
      ...createGradientColorMap([255, 0, 0], [255, 0, 255], step),
      ...createGradientColorMap([255, 0, 255], [0, 0, 255], step),
    ];
    const blueToGreenInterval = [
      ...createGradientColorMap([0, 0, 255], [0, 255, 255], step),
      ...createGradientColorMap([0, 255, 255], [0, 255, 0], step),
    ];
    const greenToRedInterval = [
      ...createGradientColorMap([0, 255, 0], [255, 255, 0], step),
      ...createGradientColorMap([255, 255, 0], [255, 0, 0], step),
    ];
    const gradientMap = [...redToBlueInterval, ...blueToGreenInterval, ...greenToRedInterval];

    const blockWidth = width / (step * 6);
    const blockHeight = height;
    let blockX = 0;

    const trackerBg = new Graphics();

    gradientMap.forEach(color => {
      trackerBg.beginFill(rgbToHex(color[0], color[1], color[2], true) as number);
      trackerBg.drawRect(blockX, 0, blockWidth, blockHeight);
      blockX += blockWidth;
    });

    mainColorTracker.stage.addChild(trackerBg);
  }

  private getMainColorFromPosition(position: number, width: number): Rgb {
    const step = 256;
    const redToBlueInterval = [
      ...createGradientColorMap([255, 0, 0], [255, 0, 255], step),
      ...createGradientColorMap([255, 0, 255], [0, 0, 255], step),
    ];
    const blueToGreenInterval = [
      ...createGradientColorMap([0, 0, 255], [0, 255, 255], step),
      ...createGradientColorMap([0, 255, 255], [0, 255, 0], step),
    ];
    const greenToRedInterval = [
      ...createGradientColorMap([0, 255, 0], [255, 255, 0], step),
      ...createGradientColorMap([255, 255, 0], [255, 0, 0], step),
    ];
    const gradientMap = [...redToBlueInterval, ...blueToGreenInterval, ...greenToRedInterval];
    const gradientLength = gradientMap.length;
    const percentage = position / width;
    let colorIndex = Math.floor(gradientLength * percentage);
    colorIndex = colorIndex === gradientLength ? colorIndex - 1 : colorIndex;

    return gradientMap[colorIndex];
  }

  private createMainColorGradientMap() {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouseMove$.next(e);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e: MouseEvent): void {
    this.mouseUpOrLeave$.next(e);
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(e: MouseEvent): void {
    this.mouseUpOrLeave$.next(e);
  }
}
