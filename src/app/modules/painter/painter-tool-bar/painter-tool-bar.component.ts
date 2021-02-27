import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, HostBinding } from '@angular/core';

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
export class PainterToolBarComponent {
  @Input()
  @HostBinding('class.vertical')
  vertical = false;

  @HostBinding('class.top') get top(): boolean {
    return this.align === 'top';
  }
  @HostBinding('class.right') get right(): boolean {
    return this.align === 'right';
  }
  @HostBinding('class.bottom') get bottom(): boolean {
    return this.align === 'bottom';
  }
  @HostBinding('class.left') get left(): boolean {
    return this.align === 'left';
  }

  @Input()
  align?: string;
}
