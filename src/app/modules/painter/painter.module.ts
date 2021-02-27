import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { PainterComponent } from './painter.component';
import { PainterToolBarComponent } from './painter-tool-bar/painter-tool-bar.component';
import { PainterToolComponent } from './painter-tool/painter-tool.component';

@NgModule({
  declarations: [PainterComponent, PainterToolBarComponent, PainterToolComponent],
  imports: [CommonModule, SharedModule],
  exports: [PainterComponent, PainterToolBarComponent, PainterToolComponent],
})
export class PainterModule {}
