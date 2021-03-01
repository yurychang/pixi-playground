import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent implements OnInit {
  @Input() color = '0xffffff';
  @Output() colorChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
