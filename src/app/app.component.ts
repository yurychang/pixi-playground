import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PainterOptions } from './modules/painter/painter.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  painterOptions: PainterOptions = {
    width: 600,
    height: 400,
  };

  constructor(@Inject(DOCUMENT) private document: Document) {}
}
