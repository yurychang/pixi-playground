import { Component, OnInit } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-painter-main-control',
  templateUrl: './painter-main-control.component.html',
  styleUrls: ['./painter-main-control.component.scss'],
})
export class PainterMainControlComponent {
  faPen = faPen;
}
