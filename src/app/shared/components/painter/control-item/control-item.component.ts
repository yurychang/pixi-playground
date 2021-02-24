import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-control-item',
  templateUrl: './control-item.component.html',
  styleUrls: ['./control-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlItemComponent implements OnInit {
  @Input()
  @HostBinding('class.circle')
  circle = false;

  constructor() {}

  ngOnInit(): void {}
}
