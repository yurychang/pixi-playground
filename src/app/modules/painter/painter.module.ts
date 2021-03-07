import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { PainterComponent } from './painter.component';
import { PainterToolBarComponent } from './painter-tool-bar/painter-tool-bar.component';
import { PainterToolComponent } from './painter-tool/painter-tool.component';
import { PainterCanvasComponent } from './painter-canvas/painter-canvas.component';

@NgModule({
  declarations: [PainterComponent, PainterToolBarComponent, PainterToolComponent, PainterCanvasComponent],
  imports: [CommonModule, SharedModule],
  exports: [PainterComponent, PainterToolBarComponent, PainterToolComponent, PainterCanvasComponent],
})
export class PainterModule {}
