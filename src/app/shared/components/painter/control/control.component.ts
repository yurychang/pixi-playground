import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent implements OnInit {
  @Input()
  @HostBinding('class.vertical')
  vertical = false;

  constructor() {}

  ngOnInit(): void {}
}
