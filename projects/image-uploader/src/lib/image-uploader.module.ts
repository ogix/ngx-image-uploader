import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageUploaderComponent } from './image-uploader.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ImageUploaderComponent],
  exports: [ImageUploaderComponent]
})
export class ImageUploaderModule { }
