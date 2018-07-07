import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ImageUploaderModule } from 'image-uploader';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImageUploaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
