/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Component, ViewChild, ElementRef, Renderer, Input, Output, EventEmitter, ChangeDetectorRef, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import Cropper from 'cropperjs';
import { ImageUploaderService } from './image-uploader.service';
import { createImage, resizeImage } from './utils';
/** @enum {number} */
const Status = {
    NotSelected: 0,
    Selected: 1,
    Uploading: 2,
    Loading: 3,
    Loaded: 4,
    Error: 5,
};
export { Status };
Status[Status.NotSelected] = "NotSelected";
Status[Status.Selected] = "Selected";
Status[Status.Uploading] = "Uploading";
Status[Status.Loading] = "Loading";
Status[Status.Loaded] = "Loaded";
Status[Status.Error] = "Error";
export class ImageUploaderComponent {
    /**
     * @param {?} renderer
     * @param {?} uploader
     * @param {?} changeDetector
     */
    constructor(renderer, uploader, changeDetector) {
        this.renderer = renderer;
        this.uploader = uploader;
        this.changeDetector = changeDetector;
        this.statusEnum = Status;
        this._status = Status.NotSelected;
        this.thumbnailWidth = 150;
        this.thumbnailHeight = 150;
        this.cropper = undefined;
        this.upload = new EventEmitter();
        this.statusChange = new EventEmitter();
        this.propagateChange = (_) => { };
    }
    /**
     * @return {?}
     */
    get imageThumbnail() {
        return this._imageThumbnail;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set imageThumbnail(value) {
        this._imageThumbnail = value;
        this.propagateChange(this._imageThumbnail);
        if (value !== undefined) {
            this.status = Status.Selected;
        }
        else {
            this.status = Status.NotSelected;
        }
    }
    /**
     * @return {?}
     */
    get errorMessage() {
        return this._errorMessage;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set errorMessage(value) {
        this._errorMessage = value;
        if (value) {
            this.status = Status.Error;
        }
        else {
            this.status = Status.NotSelected;
        }
    }
    /**
     * @return {?}
     */
    get status() {
        return this._status;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set status(value) {
        this._status = value;
        this.statusChange.emit(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (value) {
            this.loadAndResize(value);
        }
        else {
            this._imageThumbnail = undefined;
            this.status = Status.NotSelected;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    /**
     * @return {?}
     */
    registerOnTouched() { }
    /**
     * @return {?}
     */
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
    /**
     * @return {?}
     */
    ngAfterViewChecked() {
        if (this.options && this.options.cropEnabled && this.imageElement && this.fileToUpload && !this.cropper) {
            this.cropper = new Cropper(this.imageElement.nativeElement, {
                viewMode: 1,
                aspectRatio: this.options.cropAspectRatio ? this.options.cropAspectRatio : null
            });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
    }
    /**
     * @param {?} url
     * @return {?}
     */
    loadAndResize(url) {
        this.status = Status.Loading;
        this.uploader.getFile(url, this.options).subscribe(file => {
            if (this.options.resizeOnLoad) {
                // thumbnail
                const /** @type {?} */ result = {
                    file: file,
                    url: URL.createObjectURL(file)
                };
                this.resize(result).then(r => {
                    this._imageThumbnail = r.resized.dataURL;
                    this.status = Status.Loaded;
                });
            }
            else {
                const /** @type {?} */ result = {
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
    /**
     * @return {?}
     */
    onImageClicked() {
        this.renderer.invokeElementMethod(this.fileInputElement.nativeElement, 'click');
    }
    /**
     * @return {?}
     */
    onFileChanged() {
        const /** @type {?} */ file = this.fileInputElement.nativeElement.files[0];
        if (!file) {
            return;
        }
        this.validateAndUpload(file);
    }
    /**
     * @param {?} file
     * @return {?}
     */
    validateAndUpload(file) {
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
        const /** @type {?} */ result = {
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
    /**
     * @return {?}
     */
    uploadImage() {
        this.progress = 0;
        this.status = Status.Uploading;
        let /** @type {?} */ cropOptions;
        if (this.cropper) {
            const /** @type {?} */ scale = this.origImageWidth / this.cropper.getImageData().naturalWidth;
            const /** @type {?} */ cropData = this.cropper.getData();
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
                }
                else {
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
    /**
     * @return {?}
     */
    removeImage() {
        this.fileInputElement.nativeElement.value = null;
        this.imageThumbnail = undefined;
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
    }
    /**
     * @return {?}
     */
    dismissError() {
        this.errorMessage = undefined;
        this.removeImage();
    }
    /**
     * @param {?} e
     * @return {?}
     */
    drop(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer || !e.dataTransfer.files.length) {
            return;
        }
        this.validateAndUpload(e.dataTransfer.files[0]);
        this.updateDragOverlayStyles(false);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    dragenter(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    /**
     * @param {?} e
     * @return {?}
     */
    dragover(e) {
        e.preventDefault();
        e.stopPropagation();
        this.updateDragOverlayStyles(true);
    }
    /**
     * @param {?} e
     * @return {?}
     */
    dragleave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.updateDragOverlayStyles(false);
    }
    /**
     * @param {?} isDragOver
     * @return {?}
     */
    updateDragOverlayStyles(isDragOver) {
        // TODO: find a way that does not trigger dragleave when displaying overlay
        // if (isDragOver) {
        //  this.renderer.setElementStyle(this.dragOverlayElement.nativeElement, 'display', 'block');
        // } else {
        //  this.renderer.setElementStyle(this.dragOverlayElement.nativeElement, 'display', 'none');
        // }
    }
    /**
     * @param {?} result
     * @return {?}
     */
    resize(result) {
        const /** @type {?} */ resizeOptions = {
            resizeHeight: this.thumbnailHeight,
            resizeWidth: this.thumbnailWidth,
            resizeType: result.file.type,
            resizeMode: this.options.thumbnailResizeMode
        };
        return new Promise((resolve) => {
            createImage(result.url, image => {
                const /** @type {?} */ dataUrl = resizeImage(image, resizeOptions);
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
    /**
     * @param {?} dataUrl
     * @return {?}
     */
    getType(dataUrl) {
        return dataUrl.match(/:(.+\/.+;)/)[1];
    }
    /**
     * @param {?} file
     * @param {?} result
     * @return {?}
     */
    fileToDataURL(file, result) {
        return new Promise((resolve) => {
            const /** @type {?} */ reader = new FileReader();
            reader.onload = function (e) {
                result.dataURL = reader.result;
                resolve(result);
            };
            reader.readAsDataURL(file);
        });
    }
}
ImageUploaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-image-uploader',
                template: `<div class="image-container">
  <div class="match-parent" [ngSwitch]="status">

    <div class="match-parent" *ngSwitchCase="statusEnum.NotSelected">
      <button type="button" class="add-image-btn" (click)="onImageClicked()">
          <div>
            <p class="plus">+</p>
            <p>Click here to add image</p>
            <p>Or drop image here</p>
          </div>
      </button>
    </div>

    <div class="selected-status-wrapper match-parent" *ngSwitchCase="statusEnum.Loaded">
      <img [src]="imageThumbnail" #imageElement>

      <button type="button" class="remove" (click)="removeImage()">×</button>
    </div>

    <div class="selected-status-wrapper match-parent" *ngSwitchCase="statusEnum.Selected">
      <img [src]="imageThumbnail" #imageElement>

      <button type="button" class="remove" (click)="removeImage()">×</button>
    </div>

    <div *ngSwitchCase="statusEnum.Uploading">
      <img [attr.src]="imageThumbnail ? imageThumbnail : null" (click)="onImageClicked()">

      <div class="progress-bar">
        <div class="bar" [style.width]="progress+'%'"></div>
      </div>
    </div>

    <div class="match-parent" *ngSwitchCase="statusEnum.Loading">
      <div class="sk-fading-circle">
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
      </div>
    </div>

    <div class="match-parent" *ngSwitchCase="statusEnum.Error">
      <div class="error">
        <div class="error-message">
          <p>{{errorMessage}}</p>
        </div>
        <button type="button" class="remove" (click)="dismissError()">×</button>
      </div>
    </div>
  </div>

  <input type="file" #fileInput (change)="onFileChanged()">
  <div class="drag-overlay" [hidden]="true" #dragOverlay></div>
</div>
`,
                styles: [`:host{display:block}.match-parent{width:100%;height:100%}.add-image-btn{width:100%;height:100%;font-weight:700;opacity:.5;border:0}.add-image-btn:hover{opacity:.7;cursor:pointer;background-color:#ddd;box-shadow:inset 0 0 5px rgba(0,0,0,.3)}.add-image-btn .plus{font-size:30px;font-weight:400;margin-bottom:5px;margin-top:5px}img{cursor:pointer;position:absolute;top:50%;left:50%;margin-right:-50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);max-width:100%}.image-container{width:100%;height:100%;position:relative;display:inline-block;background-color:#f1f1f1;box-shadow:inset 0 0 5px rgba(0,0,0,.2)}.remove{position:absolute;top:0;right:0;width:40px;height:40px;font-size:25px;text-align:center;opacity:.8;border:0;cursor:pointer}.selected-status-wrapper>.remove:hover{opacity:.7;background-color:#fff}.error .remove{opacity:.5}.error .remove:hover{opacity:.7}input{display:none}.error{width:100%;height:100%;border:1px solid #e3a5a2;color:#d2706b;background-color:#fbf1f0;position:relative;text-align:center;display:flex;align-items:center}.error-message{width:100%;line-height:18px}.progress-bar{position:absolute;bottom:10%;left:10%;width:80%;height:5px;background-color:grey;opacity:.9;overflow:hidden}.bar{position:absolute;height:100%;background-color:#a4c639}.drag-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background-color:#ff0;opacity:.3}.sk-fading-circle{width:40px;height:40px;position:relative;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:'';display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;-webkit-animation:1.2s ease-in-out infinite both sk-circleFadeDelay;animation:1.2s ease-in-out infinite both sk-circleFadeDelay}.sk-fading-circle .sk-circle2{-webkit-transform:rotate(30deg);transform:rotate(30deg)}.sk-fading-circle .sk-circle3{-webkit-transform:rotate(60deg);transform:rotate(60deg)}.sk-fading-circle .sk-circle4{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.sk-fading-circle .sk-circle5{-webkit-transform:rotate(120deg);transform:rotate(120deg)}.sk-fading-circle .sk-circle6{-webkit-transform:rotate(150deg);transform:rotate(150deg)}.sk-fading-circle .sk-circle7{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.sk-fading-circle .sk-circle8{-webkit-transform:rotate(210deg);transform:rotate(210deg)}.sk-fading-circle .sk-circle9{-webkit-transform:rotate(240deg);transform:rotate(240deg)}.sk-fading-circle .sk-circle10{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.sk-fading-circle .sk-circle11{-webkit-transform:rotate(300deg);transform:rotate(300deg)}.sk-fading-circle .sk-circle12{-webkit-transform:rotate(330deg);transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.sk-fading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}@keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}`],
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
            },] },
];
/** @nocollapse */
ImageUploaderComponent.ctorParameters = () => [
    { type: Renderer, },
    { type: ImageUploaderService, },
    { type: ChangeDetectorRef, },
];
ImageUploaderComponent.propDecorators = {
    "imageElement": [{ type: ViewChild, args: ['imageElement',] },],
    "fileInputElement": [{ type: ViewChild, args: ['fileInput',] },],
    "dragOverlayElement": [{ type: ViewChild, args: ['dragOverlay',] },],
    "options": [{ type: Input },],
    "upload": [{ type: Output },],
    "statusChange": [{ type: Output },],
    "drop": [{ type: HostListener, args: ['drop', ['$event'],] },],
    "dragenter": [{ type: HostListener, args: ['dragenter', ['$event'],] },],
    "dragover": [{ type: HostListener, args: ['dragover', ['$event'],] },],
    "dragleave": [{ type: HostListener, args: ['dragleave', ['$event'],] },],
};
function ImageUploaderComponent_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ImageUploaderComponent.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ImageUploaderComponent.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    ImageUploaderComponent.propDecorators;
    /** @type {?} */
    ImageUploaderComponent.prototype.statusEnum;
    /** @type {?} */
    ImageUploaderComponent.prototype._status;
    /** @type {?} */
    ImageUploaderComponent.prototype.thumbnailWidth;
    /** @type {?} */
    ImageUploaderComponent.prototype.thumbnailHeight;
    /** @type {?} */
    ImageUploaderComponent.prototype._imageThumbnail;
    /** @type {?} */
    ImageUploaderComponent.prototype._errorMessage;
    /** @type {?} */
    ImageUploaderComponent.prototype.progress;
    /** @type {?} */
    ImageUploaderComponent.prototype.origImageWidth;
    /** @type {?} */
    ImageUploaderComponent.prototype.orgiImageHeight;
    /** @type {?} */
    ImageUploaderComponent.prototype.cropper;
    /** @type {?} */
    ImageUploaderComponent.prototype.fileToUpload;
    /** @type {?} */
    ImageUploaderComponent.prototype.imageElement;
    /** @type {?} */
    ImageUploaderComponent.prototype.fileInputElement;
    /** @type {?} */
    ImageUploaderComponent.prototype.dragOverlayElement;
    /** @type {?} */
    ImageUploaderComponent.prototype.options;
    /** @type {?} */
    ImageUploaderComponent.prototype.upload;
    /** @type {?} */
    ImageUploaderComponent.prototype.statusChange;
    /** @type {?} */
    ImageUploaderComponent.prototype.propagateChange;
    /** @type {?} */
    ImageUploaderComponent.prototype.renderer;
    /** @type {?} */
    ImageUploaderComponent.prototype.uploader;
    /** @type {?} */
    ImageUploaderComponent.prototype.changeDetector;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtdXBsb2FkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWltYWdlLXVwbG9hZGVyLyIsInNvdXJjZXMiOlsibGliL2ltYWdlLXVwbG9hZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBdUMsU0FBUyxFQUFFLFVBQVUsRUFDckUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQ25GLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLE9BQU8sTUFBTSxXQUFXLENBQUM7QUFFaEMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkZuRCxNQUFNOzs7Ozs7SUF3QkosWUFDVSxVQUNBLFVBQ0E7UUFGQSxhQUFRLEdBQVIsUUFBUTtRQUNSLGFBQVEsR0FBUixRQUFRO1FBQ1IsbUJBQWMsR0FBZCxjQUFjOzBCQTFCWCxNQUFNO3VCQUNELE1BQU0sQ0FBQyxXQUFXOzhCQUVuQixHQUFHOytCQUNGLEdBQUc7dUJBT0YsU0FBUztzQkFPc0IsSUFBSSxZQUFZLEVBQW1COzRCQUN0QyxJQUFJLFlBQVksRUFBVTsrQkFFdkQsQ0FBQyxDQUFNLEVBQUUsRUFBRSxJQUFHO0tBS2dCOzs7O0lBRWhELElBQUksY0FBYztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztLQUM3Qjs7Ozs7SUFFRCxJQUFJLGNBQWMsQ0FBQyxLQUFLO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVB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QyxRQUFRLENBQUM7eUJBS3BDLFlBQVksU0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUM7MEJBTW5DLFlBQVksU0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCwgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0NoZWNrZWQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZixcclxuICBSZW5kZXJlciwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3RvclJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IENyb3BwZXIgZnJvbSAnY3JvcHBlcmpzJztcclxuXHJcbmltcG9ydCB7IEltYWdlVXBsb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9pbWFnZS11cGxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWRlck9wdGlvbnMsIEltYWdlUmVzdWx0LCBSZXNpemVPcHRpb25zLCBDcm9wT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IGNyZWF0ZUltYWdlLCByZXNpemVJbWFnZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBGaWxlUXVldWVPYmplY3QgfSBmcm9tICcuL2ZpbGUtcXVldWUtb2JqZWN0JztcclxuXHJcbmV4cG9ydCBlbnVtIFN0YXR1cyB7XHJcbiAgTm90U2VsZWN0ZWQsXHJcbiAgU2VsZWN0ZWQsXHJcbiAgVXBsb2FkaW5nLFxyXG4gIExvYWRpbmcsXHJcbiAgTG9hZGVkLFxyXG4gIEVycm9yXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWltYWdlLXVwbG9hZGVyJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJpbWFnZS1jb250YWluZXJcIj5cclxuICA8ZGl2IGNsYXNzPVwibWF0Y2gtcGFyZW50XCIgW25nU3dpdGNoXT1cInN0YXR1c1wiPlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5Ob3RTZWxlY3RlZFwiPlxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImFkZC1pbWFnZS1idG5cIiAoY2xpY2spPVwib25JbWFnZUNsaWNrZWQoKVwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPHAgY2xhc3M9XCJwbHVzXCI+KzwvcD5cclxuICAgICAgICAgICAgPHA+Q2xpY2sgaGVyZSB0byBhZGQgaW1hZ2U8L3A+XHJcbiAgICAgICAgICAgIDxwPk9yIGRyb3AgaW1hZ2UgaGVyZTwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RlZC1zdGF0dXMtd3JhcHBlciBtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5Mb2FkZWRcIj5cclxuICAgICAgPGltZyBbc3JjXT1cImltYWdlVGh1bWJuYWlsXCIgI2ltYWdlRWxlbWVudD5cclxuXHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicmVtb3ZlXCIgKGNsaWNrKT1cInJlbW92ZUltYWdlKClcIj7DlzwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInNlbGVjdGVkLXN0YXR1cy13cmFwcGVyIG1hdGNoLXBhcmVudFwiICpuZ1N3aXRjaENhc2U9XCJzdGF0dXNFbnVtLlNlbGVjdGVkXCI+XHJcbiAgICAgIDxpbWcgW3NyY109XCJpbWFnZVRodW1ibmFpbFwiICNpbWFnZUVsZW1lbnQ+XHJcblxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInJlbW92ZVwiIChjbGljayk9XCJyZW1vdmVJbWFnZSgpXCI+w5c8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgKm5nU3dpdGNoQ2FzZT1cInN0YXR1c0VudW0uVXBsb2FkaW5nXCI+XHJcbiAgICAgIDxpbWcgW2F0dHIuc3JjXT1cImltYWdlVGh1bWJuYWlsID8gaW1hZ2VUaHVtYm5haWwgOiBudWxsXCIgKGNsaWNrKT1cIm9uSW1hZ2VDbGlja2VkKClcIj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYmFyXCIgW3N0eWxlLndpZHRoXT1cInByb2dyZXNzKyclJ1wiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5Mb2FkaW5nXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJzay1mYWRpbmctY2lyY2xlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTEgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTIgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTMgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTQgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTUgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTYgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTcgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTggc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTkgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTEwIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUxMSBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMTIgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cIm1hdGNoLXBhcmVudFwiICpuZ1N3aXRjaENhc2U9XCJzdGF0dXNFbnVtLkVycm9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJlcnJvclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJlcnJvci1tZXNzYWdlXCI+XHJcbiAgICAgICAgICA8cD57e2Vycm9yTWVzc2FnZX19PC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicmVtb3ZlXCIgKGNsaWNrKT1cImRpc21pc3NFcnJvcigpXCI+w5c8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGlucHV0IHR5cGU9XCJmaWxlXCIgI2ZpbGVJbnB1dCAoY2hhbmdlKT1cIm9uRmlsZUNoYW5nZWQoKVwiPlxyXG4gIDxkaXYgY2xhc3M9XCJkcmFnLW92ZXJsYXlcIiBbaGlkZGVuXT1cInRydWVcIiAjZHJhZ092ZXJsYXk+PC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2A6aG9zdHtkaXNwbGF5OmJsb2NrfS5tYXRjaC1wYXJlbnR7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJX0uYWRkLWltYWdlLWJ0bnt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2ZvbnQtd2VpZ2h0OjcwMDtvcGFjaXR5Oi41O2JvcmRlcjowfS5hZGQtaW1hZ2UtYnRuOmhvdmVye29wYWNpdHk6Ljc7Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZC1jb2xvcjojZGRkO2JveC1zaGFkb3c6aW5zZXQgMCAwIDVweCByZ2JhKDAsMCwwLC4zKX0uYWRkLWltYWdlLWJ0biAucGx1c3tmb250LXNpemU6MzBweDtmb250LXdlaWdodDo0MDA7bWFyZ2luLWJvdHRvbTo1cHg7bWFyZ2luLXRvcDo1cHh9aW1ne2N1cnNvcjpwb2ludGVyO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7bWFyZ2luLXJpZ2h0Oi01MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO21heC13aWR0aDoxMDAlfS5pbWFnZS1jb250YWluZXJ7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kLWNvbG9yOiNmMWYxZjE7Ym94LXNoYWRvdzppbnNldCAwIDAgNXB4IHJnYmEoMCwwLDAsLjIpfS5yZW1vdmV7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7cmlnaHQ6MDt3aWR0aDo0MHB4O2hlaWdodDo0MHB4O2ZvbnQtc2l6ZToyNXB4O3RleHQtYWxpZ246Y2VudGVyO29wYWNpdHk6Ljg7Ym9yZGVyOjA7Y3Vyc29yOnBvaW50ZXJ9LnNlbGVjdGVkLXN0YXR1cy13cmFwcGVyPi5yZW1vdmU6aG92ZXJ7b3BhY2l0eTouNztiYWNrZ3JvdW5kLWNvbG9yOiNmZmZ9LmVycm9yIC5yZW1vdmV7b3BhY2l0eTouNX0uZXJyb3IgLnJlbW92ZTpob3ZlcntvcGFjaXR5Oi43fWlucHV0e2Rpc3BsYXk6bm9uZX0uZXJyb3J7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtib3JkZXI6MXB4IHNvbGlkICNlM2E1YTI7Y29sb3I6I2QyNzA2YjtiYWNrZ3JvdW5kLWNvbG9yOiNmYmYxZjA7cG9zaXRpb246cmVsYXRpdmU7dGV4dC1hbGlnbjpjZW50ZXI7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcn0uZXJyb3ItbWVzc2FnZXt3aWR0aDoxMDAlO2xpbmUtaGVpZ2h0OjE4cHh9LnByb2dyZXNzLWJhcntwb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MTAlO2xlZnQ6MTAlO3dpZHRoOjgwJTtoZWlnaHQ6NXB4O2JhY2tncm91bmQtY29sb3I6Z3JleTtvcGFjaXR5Oi45O292ZXJmbG93OmhpZGRlbn0uYmFye3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO2JhY2tncm91bmQtY29sb3I6I2E0YzYzOX0uZHJhZy1vdmVybGF5e3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JhY2tncm91bmQtY29sb3I6I2ZmMDtvcGFjaXR5Oi4zfS5zay1mYWRpbmctY2lyY2xle3dpZHRoOjQwcHg7aGVpZ2h0OjQwcHg7cG9zaXRpb246cmVsYXRpdmU7dG9wOjUwJTtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MH0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOmJlZm9yZXtjb250ZW50OicnO2Rpc3BsYXk6YmxvY2s7bWFyZ2luOjAgYXV0bzt3aWR0aDoxNSU7aGVpZ2h0OjE1JTtiYWNrZ3JvdW5kLWNvbG9yOiMzMzM7Ym9yZGVyLXJhZGl1czoxMDAlOy13ZWJraXQtYW5pbWF0aW9uOjEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYm90aCBzay1jaXJjbGVGYWRlRGVsYXk7YW5pbWF0aW9uOjEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYm90aCBzay1jaXJjbGVGYWRlRGVsYXl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTJ7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDMwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlM3std2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNjBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoNjBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU0ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSg5MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDEyMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgxMjBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU2ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgxNTBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMTUwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlN3std2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDE4MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTh7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDIxMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgyMTBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU5ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgyNDBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMjQwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTB7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDI3MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgyNzBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMwMGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTEyey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMzBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMzMwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LTEuMXM7YW5pbWF0aW9uLWRlbGF5Oi0xLjFzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUzOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotMXM7YW5pbWF0aW9uLWRlbGF5Oi0xc30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNDpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS45czthbmltYXRpb24tZGVsYXk6LS45c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS44czthbmltYXRpb24tZGVsYXk6LS44c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS43czthbmltYXRpb24tZGVsYXk6LS43c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNzpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS42czthbmltYXRpb24tZGVsYXk6LS42c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlODpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS41czthbmltYXRpb24tZGVsYXk6LS41c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS40czthbmltYXRpb24tZGVsYXk6LS40c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTA6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uM3M7YW5pbWF0aW9uLWRlbGF5Oi0uM3N9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTExOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotLjJzO2FuaW1hdGlvbi1kZWxheTotLjJzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS4xczthbmltYXRpb24tZGVsYXk6LS4xc31ALXdlYmtpdC1rZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5ezAlLDEwMCUsMzkle29wYWNpdHk6MH00MCV7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHNrLWNpcmNsZUZhZGVEZWxheXswJSwxMDAlLDM5JXtvcGFjaXR5OjB9NDAle29wYWNpdHk6MX19YF0sXHJcbiAgaG9zdDoge1xyXG4gICAgJ1tzdHlsZS53aWR0aF0nOiAndGh1bWJuYWlsV2lkdGggKyBcInB4XCInLFxyXG4gICAgJ1tzdHlsZS5oZWlnaHRdJzogJ3RodW1ibmFpbEhlaWdodCArIFwicHhcIidcclxuICB9LFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gSW1hZ2VVcGxvYWRlckNvbXBvbmVudCksXHJcbiAgICAgIG11bHRpOiB0cnVlXHJcbiAgICB9XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdDaGVja2VkLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcbiAgc3RhdHVzRW51bSA9IFN0YXR1cztcclxuICBfc3RhdHVzOiBTdGF0dXMgPSBTdGF0dXMuTm90U2VsZWN0ZWQ7XHJcblxyXG4gIHRodW1ibmFpbFdpZHRoID0gMTUwO1xyXG4gIHRodW1ibmFpbEhlaWdodCA9IDE1MDtcclxuICBfaW1hZ2VUaHVtYm5haWw6IGFueTtcclxuICBfZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgcHJvZ3Jlc3M6IG51bWJlcjtcclxuICBvcmlnSW1hZ2VXaWR0aDogbnVtYmVyO1xyXG4gIG9yZ2lJbWFnZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICBjcm9wcGVyOiBDcm9wcGVyID0gdW5kZWZpbmVkO1xyXG4gIGZpbGVUb1VwbG9hZDogRmlsZTtcclxuXHJcbiAgQFZpZXdDaGlsZCgnaW1hZ2VFbGVtZW50JykgaW1hZ2VFbGVtZW50OiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2ZpbGVJbnB1dCcpIGZpbGVJbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnZHJhZ092ZXJsYXknKSBkcmFnT3ZlcmxheUVsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcbiAgQElucHV0KCkgb3B0aW9uczogSW1hZ2VVcGxvYWRlck9wdGlvbnM7XHJcbiAgQE91dHB1dCgpIHVwbG9hZDogRXZlbnRFbWl0dGVyPEZpbGVRdWV1ZU9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPEZpbGVRdWV1ZU9iamVjdD4oKTtcclxuICBAT3V0cHV0KCkgc3RhdHVzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8U3RhdHVzPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3RhdHVzPigpO1xyXG5cclxuICBwcm9wYWdhdGVDaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcixcclxuICAgIHByaXZhdGUgdXBsb2FkZXI6IEltYWdlVXBsb2FkZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHsgfVxyXG5cclxuICBnZXQgaW1hZ2VUaHVtYm5haWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5faW1hZ2VUaHVtYm5haWw7XHJcbiAgfVxyXG5cclxuICBzZXQgaW1hZ2VUaHVtYm5haWwodmFsdWUpIHtcclxuICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gdmFsdWU7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSh0aGlzLl9pbWFnZVRodW1ibmFpbCk7XHJcblxyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuU2VsZWN0ZWQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Ob3RTZWxlY3RlZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBlcnJvck1lc3NhZ2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZXJyb3JNZXNzYWdlO1xyXG4gIH1cclxuXHJcbiAgc2V0IGVycm9yTWVzc2FnZSh2YWx1ZSkge1xyXG4gICAgdGhpcy5fZXJyb3JNZXNzYWdlID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLkVycm9yO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTm90U2VsZWN0ZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgc3RhdHVzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcclxuICB9XHJcblxyXG4gIHNldCBzdGF0dXModmFsdWUpIHtcclxuICAgIHRoaXMuX3N0YXR1cyA9IHZhbHVlO1xyXG4gICAgdGhpcy5zdGF0dXNDaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICB0aGlzLmxvYWRBbmRSZXNpemUodmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLk5vdFNlbGVjdGVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UgPSBmbjtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKCkge31cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGh1bWJuYWlsV2lkdGgpIHtcclxuICAgICAgICB0aGlzLnRodW1ibmFpbFdpZHRoID0gdGhpcy5vcHRpb25zLnRodW1ibmFpbFdpZHRoO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy50aHVtYm5haWxIZWlnaHQgPSB0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVzaXplT25Mb2FkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucmVzaXplT25Mb2FkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9VcGxvYWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5hdXRvVXBsb2FkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNyb3BFbmFibGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuY3JvcEVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvVXBsb2FkICYmIHRoaXMub3B0aW9ucy5jcm9wRW5hYmxlZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYXV0b1VwbG9hZCBhbmQgY3JvcEVuYWJsZWQgY2Fubm90IGJlIGVuYWJsZWQgc2ltdWx0YW5lb3VzbHknKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY3JvcEVuYWJsZWQgJiYgdGhpcy5pbWFnZUVsZW1lbnQgJiYgdGhpcy5maWxlVG9VcGxvYWQgJiYgIXRoaXMuY3JvcHBlcikge1xyXG4gICAgICB0aGlzLmNyb3BwZXIgPSBuZXcgQ3JvcHBlcih0aGlzLmltYWdlRWxlbWVudC5uYXRpdmVFbGVtZW50LCB7XHJcbiAgICAgICAgdmlld01vZGU6IDEsXHJcbiAgICAgICAgYXNwZWN0UmF0aW86IHRoaXMub3B0aW9ucy5jcm9wQXNwZWN0UmF0aW8gPyB0aGlzLm9wdGlvbnMuY3JvcEFzcGVjdFJhdGlvIDogbnVsbFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMuY3JvcHBlcikge1xyXG4gICAgICB0aGlzLmNyb3BwZXIuZGVzdHJveSgpO1xyXG4gICAgICB0aGlzLmNyb3BwZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZEFuZFJlc2l6ZSh1cmw6IHN0cmluZykge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTG9hZGluZztcclxuXHJcbiAgICB0aGlzLnVwbG9hZGVyLmdldEZpbGUodXJsLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShmaWxlID0+IHtcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXNpemVPbkxvYWQpIHtcclxuICAgICAgICAvLyB0aHVtYm5haWxcclxuICAgICAgICBjb25zdCByZXN1bHQ6IEltYWdlUmVzdWx0ID0ge1xyXG4gICAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICAgIHVybDogVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzaXplKHJlc3VsdCkudGhlbihyID0+IHtcclxuICAgICAgICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gci5yZXNpemVkLmRhdGFVUkw7XHJcbiAgICAgICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Mb2FkZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJbWFnZVJlc3VsdCA9IHtcclxuICAgICAgICAgIGZpbGU6IG51bGwsXHJcbiAgICAgICAgICB1cmw6IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVUb0RhdGFVUkwoZmlsZSwgcmVzdWx0KS50aGVuKHIgPT4ge1xyXG4gICAgICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSByLmRhdGFVUkw7XHJcbiAgICAgICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Mb2FkZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBlcnJvciB8fCAnRXJyb3Igd2hpbGUgZ2V0dGluZyBhbiBpbWFnZSc7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uSW1hZ2VDbGlja2VkKCkge1xyXG4gICAgdGhpcy5yZW5kZXJlci5pbnZva2VFbGVtZW50TWV0aG9kKHRoaXMuZmlsZUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY2xpY2snKTtcclxuICB9XHJcblxyXG4gIG9uRmlsZUNoYW5nZWQoKSB7XHJcbiAgICBjb25zdCBmaWxlID0gdGhpcy5maWxlSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZmlsZXNbMF07XHJcbiAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmFsaWRhdGVBbmRVcGxvYWQoZmlsZSk7XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZUFuZFVwbG9hZChmaWxlOiBGaWxlKSB7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShudWxsKTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcykge1xyXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcy5zb21lKGFsbG93ZWRUeXBlID0+IGZpbGUudHlwZSA9PT0gYWxsb3dlZFR5cGUpKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSAnT25seSB0aGVzZSBpbWFnZSB0eXBlcyBhcmUgYWxsb3dlZDogJyArIHRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcy5qb2luKCcsICcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm1heEltYWdlU2l6ZSkge1xyXG4gICAgICBpZiAoZmlsZS5zaXplID4gdGhpcy5vcHRpb25zLm1heEltYWdlU2l6ZSAqIDEwMjQgKiAxMDI0KSB7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBgSW1hZ2UgbXVzdCBub3QgYmUgbGFyZ2VyIHRoYW4gJHt0aGlzLm9wdGlvbnMubWF4SW1hZ2VTaXplfSBNQmA7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5maWxlVG9VcGxvYWQgPSBmaWxlO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmF1dG9VcGxvYWQpIHtcclxuICAgICAgdGhpcy51cGxvYWRJbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRodW1ibmFpbFxyXG4gICAgY29uc3QgcmVzdWx0OiBJbWFnZVJlc3VsdCA9IHtcclxuICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgdXJsOiBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVzaXplKHJlc3VsdCkudGhlbihyID0+IHtcclxuICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSByLnJlc2l6ZWQuZGF0YVVSTDtcclxuICAgICAgdGhpcy5vcmlnSW1hZ2VXaWR0aCA9IHIud2lkdGg7XHJcbiAgICAgIHRoaXMub3JnaUltYWdlSGVpZ2h0ID0gci5oZWlnaHQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zICYmICF0aGlzLm9wdGlvbnMuYXV0b1VwbG9hZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLlNlbGVjdGVkO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwbG9hZEltYWdlKCkge1xyXG4gICAgdGhpcy5wcm9ncmVzcyA9IDA7XHJcbiAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5VcGxvYWRpbmc7XHJcblxyXG4gICAgbGV0IGNyb3BPcHRpb25zOiBDcm9wT3B0aW9ucztcclxuXHJcbiAgICBpZiAodGhpcy5jcm9wcGVyKSB7XHJcbiAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5vcmlnSW1hZ2VXaWR0aCAvIHRoaXMuY3JvcHBlci5nZXRJbWFnZURhdGEoKS5uYXR1cmFsV2lkdGg7XHJcbiAgICAgIGNvbnN0IGNyb3BEYXRhID0gdGhpcy5jcm9wcGVyLmdldERhdGEoKTtcclxuXHJcbiAgICAgIGNyb3BPcHRpb25zID0ge1xyXG4gICAgICAgIHg6IE1hdGgucm91bmQoY3JvcERhdGEueCAqIHNjYWxlKSxcclxuICAgICAgICB5OiBNYXRoLnJvdW5kKGNyb3BEYXRhLnkgKiBzY2FsZSksXHJcbiAgICAgICAgd2lkdGg6IE1hdGgucm91bmQoY3JvcERhdGEud2lkdGggKiBzY2FsZSksXHJcbiAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGNyb3BEYXRhLmhlaWdodCAqIHNjYWxlKVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgLy8gY29uc3QgcXVldWVPYmogPSB0aGlzLnVwbG9hZGVyLnVwbG9hZEZpbGUodGhpcy5maWxlVG9VcGxvYWQsIHRoaXMub3B0aW9ucywgY3JvcE9wdGlvbnMpO1xyXG5cclxuICAgIC8vIGZpbGUgcHJvZ3Jlc3NcclxuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkRmlsZSh0aGlzLmZpbGVUb1VwbG9hZCwgdGhpcy5vcHRpb25zLCBjcm9wT3B0aW9ucykuc3Vic2NyaWJlKGZpbGUgPT4ge1xyXG4gICAgICB0aGlzLnByb2dyZXNzID0gZmlsZS5wcm9ncmVzcztcclxuXHJcbiAgICAgIGlmIChmaWxlLmlzRXJyb3IoKSkge1xyXG4gICAgICAgIGlmIChmaWxlLnJlc3BvbnNlLnN0YXR1cyB8fCBmaWxlLnJlc3BvbnNlLnN0YXR1c1RleHQpIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gYCR7ZmlsZS5yZXNwb25zZS5zdGF0dXN9OiAke2ZpbGUucmVzcG9uc2Uuc3RhdHVzVGV4dH1gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9ICdFcnJvciB3aGlsZSB1cGxvYWRpbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvbiBzb21lIHVwbG9hZCBlcnJvcnMgY2hhbmdlIGRldGVjdGlvbiBkb2VzIG5vdCB3b3JrLCBzbyB3ZSBhcmUgZm9yY2luZyBtYW51YWxseVxyXG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWZpbGUuaW5Qcm9ncmVzcygpKSB7XHJcbiAgICAgICAgLy8gbm90aWZ5IHRoYXQgdmFsdWUgd2FzIGNoYW5nZWQgb25seSB3aGVuIGltYWdlIHdhcyB1cGxvYWRlZCBhbmQgbm8gZXJyb3JcclxuICAgICAgICBpZiAoZmlsZS5pc1N1Y2Nlc3MoKSkge1xyXG4gICAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UodGhpcy5faW1hZ2VUaHVtYm5haWwpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuU2VsZWN0ZWQ7XHJcbiAgICAgICAgICB0aGlzLmZpbGVUb1VwbG9hZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBsb2FkLmVtaXQoZmlsZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlSW1hZ2UoKSB7XHJcbiAgICB0aGlzLmZpbGVJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZSA9IG51bGw7XHJcbiAgICB0aGlzLmltYWdlVGh1bWJuYWlsID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGlmICh0aGlzLmNyb3BwZXIpIHtcclxuICAgICAgdGhpcy5jcm9wcGVyLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5jcm9wcGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpc21pc3NFcnJvcigpIHtcclxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5yZW1vdmVJbWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pIGRyb3AoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgIGlmICghZS5kYXRhVHJhbnNmZXIgfHwgIWUuZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52YWxpZGF0ZUFuZFVwbG9hZChlLmRhdGFUcmFuc2Zlci5maWxlc1swXSk7XHJcbiAgICB0aGlzLnVwZGF0ZURyYWdPdmVybGF5U3R5bGVzKGZhbHNlKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pIGRyYWdlbnRlcihlOiBEcmFnRXZlbnQpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnb3ZlcicsIFsnJGV2ZW50J10pIGRyYWdvdmVyKGU6IERyYWdFdmVudCkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIHRoaXMudXBkYXRlRHJhZ092ZXJsYXlTdHlsZXModHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKSBkcmFnbGVhdmUoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgdGhpcy51cGRhdGVEcmFnT3ZlcmxheVN0eWxlcyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZURyYWdPdmVybGF5U3R5bGVzKGlzRHJhZ092ZXI6IGJvb2xlYW4pIHtcclxuICAgIC8vIFRPRE86IGZpbmQgYSB3YXkgdGhhdCBkb2VzIG5vdCB0cmlnZ2VyIGRyYWdsZWF2ZSB3aGVuIGRpc3BsYXlpbmcgb3ZlcmxheVxyXG4gICAgLy8gaWYgKGlzRHJhZ092ZXIpIHtcclxuICAgIC8vICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLmRyYWdPdmVybGF5RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgLy8gfSBlbHNlIHtcclxuICAgIC8vICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLmRyYWdPdmVybGF5RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlc2l6ZShyZXN1bHQ6IEltYWdlUmVzdWx0KTogUHJvbWlzZTxJbWFnZVJlc3VsdD4ge1xyXG4gICAgY29uc3QgcmVzaXplT3B0aW9uczogUmVzaXplT3B0aW9ucyA9IHtcclxuICAgICAgcmVzaXplSGVpZ2h0OiB0aGlzLnRodW1ibmFpbEhlaWdodCxcclxuICAgICAgcmVzaXplV2lkdGg6IHRoaXMudGh1bWJuYWlsV2lkdGgsXHJcbiAgICAgIHJlc2l6ZVR5cGU6IHJlc3VsdC5maWxlLnR5cGUsXHJcbiAgICAgIHJlc2l6ZU1vZGU6IHRoaXMub3B0aW9ucy50aHVtYm5haWxSZXNpemVNb2RlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBjcmVhdGVJbWFnZShyZXN1bHQudXJsLCBpbWFnZSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YVVybCA9IHJlc2l6ZUltYWdlKGltYWdlLCByZXNpemVPcHRpb25zKTtcclxuXHJcbiAgICAgICAgcmVzdWx0LndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgcmVzdWx0LmhlaWdodCA9IGltYWdlLmhlaWdodDtcclxuICAgICAgICByZXN1bHQucmVzaXplZCA9IHtcclxuICAgICAgICAgIGRhdGFVUkw6IGRhdGFVcmwsXHJcbiAgICAgICAgICB0eXBlOiB0aGlzLmdldFR5cGUoZGF0YVVybClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFR5cGUoZGF0YVVybDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZGF0YVVybC5tYXRjaCgvOiguK1xcLy4rOykvKVsxXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZmlsZVRvRGF0YVVSTChmaWxlOiBGaWxlLCByZXN1bHQ6IEltYWdlUmVzdWx0KTogUHJvbWlzZTxJbWFnZVJlc3VsdD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHJlc3VsdC5kYXRhVVJMID0gcmVhZGVyLnJlc3VsdDtcclxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==