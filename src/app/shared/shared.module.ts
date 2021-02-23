import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainterComponent } from './components/painter/painter.component';
import { ControlComponent } from './components/painter/control/control.component';
import { ControlItemComponent } from './components/painter/control-item/control-item.component';
import { MainControlComponent } from './components/painter/main-control/main-control.component';

@NgModule({
  declarations: [PainterComponent, ControlComponent, ControlItemComponent, MainControlComponent],
  imports: [CommonModule],
  exports: [PainterComponent],
})
export class SharedModule {}
