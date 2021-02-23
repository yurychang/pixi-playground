import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-control-item',
  templateUrl: './control-item.component.html',
  styleUrls: ['./control-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
