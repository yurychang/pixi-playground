import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { PainterComponent } from './painter.component';
import { PainterControlComponent } from './painter-control/painter-control.component';
import { PainterControlItemComponent } from './painter-control-item/painter-control-item.component';
import { PainterMainControlComponent } from './painter-main-control/painter-main-control.component';
import { PainterPaletteComponent } from './painter-palette/painter-palette.component';

@NgModule({
  declarations: [PainterComponent, PainterControlComponent, PainterControlItemComponent, PainterMainControlComponent, PainterPaletteComponent],
  imports: [CommonModule, SharedModule],
  exports: [PainterComponent, PainterControlComponent, PainterControlItemComponent, PainterPaletteComponent],
})
export class PainterModule {}
