import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-painter-palette',
  templateUrl: './painter-palette.component.html',
  styleUrls: ['./painter-palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainterPaletteComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
