import { Component, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PainterComponent, PainterOptions } from './modules/painter/painter.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  painterOptions: PainterOptions = {
    width: 500,
    height: 400,
  };

  previewImg?: string;

  @ViewChild('painter') painter?: PainterComponent;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  savePainter(): void {
    if (this.painter) {
      this.previewImg = this.painter.save();
    }
  }
}
