import { Component } from '@angular/core';
import { ImageUploaderOptions } from 'ngx-image-uploader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  imageOptions: ImageUploaderOptions = {
    uploadUrl: 'https://fancy-image-uploader-demo.azurewebsites.net/api/demo/upload',
    cropEnabled: true,
    thumbnailResizeMode: 'fill',
    autoUpload: false,
    resizeOnLoad: false,
    thumbnailWidth: 320,
    thumbnailHeight: 200
  };
}
