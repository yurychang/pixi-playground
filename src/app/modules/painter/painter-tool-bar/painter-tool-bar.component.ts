import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-painter-tool-bar',
  templateUrl: './painter-tool-bar.component.html',
  styleUrls: ['./painter-tool-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'painter-tool-bar',
  },
  encapsulation: ViewEncapsulation.None,
})
export class PainterToolBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
