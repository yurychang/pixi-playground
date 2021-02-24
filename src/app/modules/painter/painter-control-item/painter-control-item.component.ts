import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-painter-control-item',
  templateUrl: './painter-control-item.component.html',
  styleUrls: ['./painter-control-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainterControlItemComponent {
  @Input()
  @HostBinding('style.width')
  @HostBinding('style.height')
  size = '24px';

  @Input()
  @HostBinding('style.background-color')
  bgColor?: string;

  @Input()
  @HostBinding('style.color')
  color?: string;
}
