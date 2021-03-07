import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScratchOffComponent } from './scratch-off.component';
import { PainterModule } from '../painter/painter.module';

@NgModule({
  declarations: [ScratchOffComponent],
  imports: [CommonModule, PainterModule],
  exports: [ScratchOffComponent],
})
export class ScratchOffModule {}
