import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ImageUploaderComponent } from './image-uploader.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [ImageUploaderComponent],
  exports: [ImageUploaderComponent]
})
export class ImageUploaderModule { }
