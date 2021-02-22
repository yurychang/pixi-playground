import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PainterComponent } from './components/painter/painter.component';

@NgModule({
  declarations: [PainterComponent],
  imports: [CommonModule],
  exports: [PainterComponent],
})
export class SharedModule {}
