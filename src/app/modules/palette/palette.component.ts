import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Rgb } from '@entities/color-type';
import { createGradientColorMap } from '@utils/color-transform/create-gradient-color-map';
import { hexToRgb } from '@utils/color-transform/hex-to-rgb';
import { rgbToHex } from '@utils/color-transform/rgb-to-hex';
import { Application, BLEND_MODES, Graphics, Sprite } from 'pixi.js';

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
  }
  private _color: string | Rgb = '#ffffff';

  @Output() colorChange = new EventEmitter<string>();

  colorPicker?: Application;

  @ViewChild('colorPicker') colorPickerRef?: ElementRef<HTMLCanvasElement>;

  private rgbColor: Rgb = [255, 255, 255];
  private mainColor: Rgb = [0, 0, 255];

  constructor() {}

  ngAfterViewInit(): void {
    this.initColorPicker();
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
}
