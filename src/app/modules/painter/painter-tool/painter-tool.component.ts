import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-painter-tool',
  templateUrl: './painter-tool.component.html',
  styleUrls: ['./painter-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'painter-tool',
  },
})
export class PainterToolComponent {
  @Input()
  @HostBinding('style.background-color')
  bgColor?: string;
}
