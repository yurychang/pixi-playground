import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PaletteComponent } from './palette.component';

@NgModule({
  declarations: [PaletteComponent],
  imports: [CommonModule, SharedModule],
  exports: [PaletteComponent],
})
export class PaletteModule {}
