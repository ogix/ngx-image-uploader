import {
  Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef,
  Renderer, Input, Output, EventEmitter, ChangeDetectorRef, forwardRef, HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Cropper from 'cropperjs';

import { ImageUploaderService } from './image-uploader.service';
import { ImageUploaderOptions, ImageResult, ResizeOptions, CropOptions } from './interfaces';
import { createImage, resizeImage } from './utils';
import { FileQueueObject } from './file-queue-object';

export enum Status {
  NotSelected,
  Selected,
  Uploading,
  Loading,
  Loaded,
  Error
}

@Component({
  selector: 'ngx-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css'],
  host: {
    '[style.width]': 'thumbnailWidth + "px"',
    '[style.height]': 'thumbnailHeight + "px"'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploaderComponent),
      multi: true
    }
  ]
})
export class ImageUploaderComponent implements OnInit, OnDestroy, AfterViewChecked, ControlValueAccessor {
  statusEnum = Status;
  _status: Status = Status.NotSelected;

  thumbnailWidth = 150;
  thumbnailHeight = 150;
  _imageThumbnail: any;
  _errorMessage: string;
  progress: number;
  origImageWidth: number;
  orgiImageHeight: number;

  cropper: Cropper = undefined;
  fileToUpload: File;

  @ViewChild('imageElement') imageElement: ElementRef;
  @ViewChild('fileInput') fileInputElement: ElementRef;
  @ViewChild('dragOverlay') dragOverlayElement: ElementRef;
  @Input() options: ImageUploaderOptions;
  @Output() upload: EventEmitter<FileQueueObject> = new EventEmitter<FileQueueObject>();
  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();

  propagateChange = (_: any) => {};

  constructor(
    private renderer: Renderer,
    private uploader: ImageUploaderService,
    private changeDetector: ChangeDetectorRef) { }

  get imageThumbnail() {
    return this._imageThumbnail;
  }

  set imageThumbnail(value) {
    this._imageThumbnail = value;
    this.propagateChange(this._imageThumbnail);

    if (value !== undefined) {
      this.status = Status.Selected;
    } else {
      this.status = Status.NotSelected;
    }
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(value) {
    this._errorMessage = value;

    if (value) {
      this.status = Status.Error;
    } else {
      this.status = Status.NotSelected;
    }
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
    this.statusChange.emit(value);
  }

  writeValue(value: any) {
    if (value) {
      this.loadAndResize(value);
    } else {
      this._imageThumbnail = undefined;
      this.status = Status.NotSelected;
    }
  }

  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  ngOnInit() {
    if (this.options) {
      if (this.options.thumbnailWidth) {
        this.thumbnailWidth = this.options.thumbnailWidth;
      }
      if (this.options.thumbnailHeight) {
        this.thumbnailHeight = this.options.thumbnailHeight;
      }
      if (this.options.resizeOnLoad === undefined) {
        this.options.resizeOnLoad = true;
      }
      if (this.options.autoUpload === undefined) {
        this.options.autoUpload = true;
      }
      if (this.options.cropEnabled === undefined) {
        this.options.cropEnabled = false;
      }

      if (this.options.autoUpload && this.options.cropEnabled) {
        throw new Error('autoUpload and cropEnabled cannot be enabled simultaneously');
      }
    }
  }

  ngAfterViewChecked() {
    if (this.options && this.options.cropEnabled && this.imageElement && this.fileToUpload && !this.cropper) {
      this.cropper = new Cropper(this.imageElement.nativeElement, {
        viewMode: 1,
        aspectRatio: this.options.cropAspectRatio ? this.options.cropAspectRatio : null
      });
    }
  }

  ngOnDestroy() {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  loadAndResize(url: string) {
    this.status = Status.Loading;

    this.uploader.getFile(url, this.options).subscribe(file => {
      if (this.options.resizeOnLoad) {
        // thumbnail
        const result: ImageResult = {
          file: file,
          url: URL.createObjectURL(file)
        };

        this.resize(result).then(r => {
          this._imageThumbnail = r.resized.dataURL;
          this.status = Status.Loaded;
        });
      } else {
        const result: ImageResult = {
          file: null,
          url: null
        };

        this.fileToDataURL(file, result).then(r => {
          this._imageThumbnail = r.dataURL;
          this.status = Status.Loaded;
        });
      }
    }, error => {
      this.errorMessage = error || 'Error while getting an image';
    });
  }

  onImageClicked() {
    this.renderer.invokeElementMethod(this.fileInputElement.nativeElement, 'click');
  }

  onFileChanged() {
    const file = this.fileInputElement.nativeElement.files[0];
    if (!file) {
      return;
    }

    this.validateAndUpload(file);
  }

  validateAndUpload(file: File) {
    this.propagateChange(null);

    if (this.options && this.options.allowedImageTypes) {
      if (!this.options.allowedImageTypes.some(allowedType => file.type === allowedType)) {
        this.errorMessage = 'Only these image types are allowed: ' + this.options.allowedImageTypes.join(', ');
        return;
      }
    }

    if (this.options && this.options.maxImageSize) {
      if (file.size > this.options.maxImageSize * 1024 * 1024) {
        this.errorMessage = `Image must not be larger than ${this.options.maxImageSize} MB`;
        return;
      }
    }

    this.fileToUpload = file;

    if (this.options && this.options.autoUpload) {
      this.uploadImage();
    }

    // thumbnail
    const result: ImageResult = {
      file: file,
      url: URL.createObjectURL(file)
    };

    this.resize(result).then(r => {
      this._imageThumbnail = r.resized.dataURL;
      this.origImageWidth = r.width;
      this.orgiImageHeight = r.height;

      if (this.options && !this.options.autoUpload) {
        this.status = Status.Selected;
      }
    });
  }

  uploadImage() {
    this.progress = 0;
    this.status = Status.Uploading;

    let cropOptions: CropOptions;

    if (this.cropper) {
      const scale = this.origImageWidth / this.cropper.getImageData().naturalWidth;
      const cropData = this.cropper.getData();

      cropOptions = {
        x: Math.round(cropData.x * scale),
        y: Math.round(cropData.y * scale),
        width: Math.round(cropData.width * scale),
        height: Math.round(cropData.height * scale)
      };
    }

   // const queueObj = this.uploader.uploadFile(this.fileToUpload, this.options, cropOptions);

    // file progress
    this.uploader.uploadFile(this.fileToUpload, this.options, cropOptions).subscribe(file => {
      this.progress = file.progress;

      if (file.isError()) {
        if (file.response.status || file.response.statusText) {
          this.errorMessage = `${file.response.status}: ${file.response.statusText}`;
        } else {
          this.errorMessage = 'Error while uploading';
        }
        // on some upload errors change detection does not work, so we are forcing manually
        this.changeDetector.detectChanges();
      }

      if (!file.inProgress()) {
        // notify that value was changed only when image was uploaded and no error
        if (file.isSuccess()) {
          this.propagateChange(this._imageThumbnail);
          this.status = Status.Selected;
          this.fileToUpload = undefined;
        }

        this.upload.emit(file);
      }
    });
  }

  removeImage() {
    this.fileInputElement.nativeElement.value = null;
    this.imageThumbnail = undefined;

    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  dismissError() {
    this.errorMessage = undefined;
    this.removeImage();
  }

  @HostListener('drop', ['$event']) drop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer || !e.dataTransfer.files.length) {
      return;
    }

    this.validateAndUpload(e.dataTransfer.files[0]);
    this.updateDragOverlayStyles(false);
  }

  @HostListener('dragenter', ['$event']) dragenter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  @HostListener('dragover', ['$event']) dragover(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.updateDragOverlayStyles(true);
  }

  @HostListener('dragleave', ['$event']) dragleave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.updateDragOverlayStyles(false);
  }

  private updateDragOverlayStyles(isDragOver: boolean) {
    // TODO: find a way that does not trigger dragleave when displaying overlay
    // if (isDragOver) {
    //  this.renderer.setElementStyle(this.dragOverlayElement.nativeElement, 'display', 'block');
    // } else {
    //  this.renderer.setElementStyle(this.dragOverlayElement.nativeElement, 'display', 'none');
    // }
  }

  private resize(result: ImageResult): Promise<ImageResult> {
    const resizeOptions: ResizeOptions = {
      resizeHeight: this.thumbnailHeight,
      resizeWidth: this.thumbnailWidth,
      resizeType: result.file.type,
      resizeMode: this.options.thumbnailResizeMode
    };

    return new Promise((resolve) => {
      createImage(result.url, image => {
        const dataUrl = resizeImage(image, resizeOptions);

        result.width = image.width;
        result.height = image.height;
        result.resized = {
          dataURL: dataUrl,
          type: this.getType(dataUrl)
        };

        resolve(result);
      });
    });
  }

  private getType(dataUrl: string) {
    return dataUrl.match(/:(.+\/.+;)/)[1];
  }

  private fileToDataURL(file: File, result: ImageResult): Promise<ImageResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        result.dataURL = reader.result;
        resolve(result);
      };
      reader.readAsDataURL(file);
    });
  }
}
