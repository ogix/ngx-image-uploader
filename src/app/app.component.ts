import { Component, ViewChild } from '@angular/core';
import { ImageUploaderOptions, ImageUploaderComponent } from 'image-uploader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  imageOptions: ImageUploaderOptions = {
    uploadUrl: 'https://api.pulseapp.eu/api/admin/news/uploadLogo',
    cropEnabled: true,
    thumbnailResizeMode: 'fill',
    autoUpload: false,
    resizeOnLoad: false,
    thumbnailWidth: 320,
    thumbnailHeight: 200
  };

  @ViewChild(ImageUploaderComponent) imageUploader: ImageUploaderComponent;

  ngAfterViewInit() {
    this.imageUploader.loadAndResize('https://pulsemediax.azureedge.net/news/64a9125e-c324-464f-8c4a-d5606bf2a0b6.jpg?width=512');
  }
}
