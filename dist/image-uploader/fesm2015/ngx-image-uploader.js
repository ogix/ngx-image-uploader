import { Observable } from 'rxjs';
import { Injectable, Component, ViewChild, Renderer, Input, Output, EventEmitter, ChangeDetectorRef, forwardRef, HostListener, NgModule, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import Cropper from 'cropperjs';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {number} */
const FileQueueStatus = {
    Pending: 0,
    Success: 1,
    Error: 2,
    Progress: 3,
};
FileQueueStatus[FileQueueStatus.Pending] = "Pending";
FileQueueStatus[FileQueueStatus.Success] = "Success";
FileQueueStatus[FileQueueStatus.Error] = "Error";
FileQueueStatus[FileQueueStatus.Progress] = "Progress";

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FileQueueObject {
    /**
     * @param {?} file
     */
    constructor(file) {
        this.status = FileQueueStatus.Pending;
        this.progress = 0;
        this.request = null;
        this.response = null;
        this.isPending = () => this.status === FileQueueStatus.Pending;
        this.isSuccess = () => this.status === FileQueueStatus.Success;
        this.isError = () => this.status === FileQueueStatus.Error;
        this.inProgress = () => this.status === FileQueueStatus.Progress;
        this.isUploadable = () => this.status === FileQueueStatus.Pending || this.status === FileQueueStatus.Error;
        this.file = file;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ImageUploaderService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * @param {?} file
     * @param {?} options
     * @param {?=} cropOptions
     * @return {?}
     */
    uploadFile(file, options, cropOptions) {
        this.setDefaults(options);
        const /** @type {?} */ form = new FormData();
        form.append(options.fieldName, file, file.name);
        if (cropOptions) {
            form.append('X', cropOptions.x.toString());
            form.append('Y', cropOptions.y.toString());
            form.append('Width', cropOptions.width.toString());
            form.append('Height', cropOptions.height.toString());
        }
        // upload file and report progress
        const /** @type {?} */ req = new HttpRequest('POST', options.uploadUrl, form, {
            reportProgress: true,
            withCredentials: options.withCredentials,
            headers: this._buildHeaders(options)
        });
        return Observable.create(obs => {
            const /** @type {?} */ queueObj = new FileQueueObject(file);
            queueObj.request = this.http.request(req).subscribe((event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    this._uploadProgress(queueObj, event);
                    obs.next(queueObj);
                }
                else if (event instanceof HttpResponse) {
                    this._uploadComplete(queueObj, event);
                    obs.next(queueObj);
                    obs.complete();
                }
            }, (err) => {
                if (err.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    this._uploadFailed(queueObj, err);
                    obs.next(queueObj);
                    obs.complete();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    this._uploadFailed(queueObj, err);
                    obs.next(queueObj);
                    obs.complete();
                }
            });
        });
    }
    /**
     * @param {?} url
     * @param {?} options
     * @return {?}
     */
    getFile(url, options) {
        return Observable.create((observer) => {
            let /** @type {?} */ headers = new HttpHeaders();
            if (options.authToken) {
                headers = headers.append('Authorization', `${options.authTokenPrefix} ${options.authToken}`);
            }
            this.http.get(url, { responseType: 'blob', headers: headers }).subscribe(res => {
                const /** @type {?} */ file = new File([res], 'filename', { type: res.type });
                observer.next(file);
                observer.complete();
            }, err => {
                observer.error(err.status);
                observer.complete();
            });
        });
    }
    /**
     * @param {?} options
     * @return {?}
     */
    _buildHeaders(options) {
        let /** @type {?} */ headers = new HttpHeaders();
        if (options.authToken) {
            headers = headers.append('Authorization', `${options.authTokenPrefix} ${options.authToken}`);
        }
        if (options.customHeaders) {
            Object.keys(options.customHeaders).forEach((key) => {
                headers = headers.append(key, options.customHeaders[key]);
            });
        }
        return headers;
    }
    /**
     * @param {?} queueObj
     * @param {?} event
     * @return {?}
     */
    _uploadProgress(queueObj, event) {
        // update the FileQueueObject with the current progress
        const /** @type {?} */ progress = Math.round(100 * event.loaded / event.total);
        queueObj.progress = progress;
        queueObj.status = FileQueueStatus.Progress;
        // this._queue.next(this._files);
    }
    /**
     * @param {?} queueObj
     * @param {?} response
     * @return {?}
     */
    _uploadComplete(queueObj, response) {
        // update the FileQueueObject as completed
        queueObj.progress = 100;
        queueObj.status = FileQueueStatus.Success;
        queueObj.response = response;
        // this._queue.next(this._files);
        // this.onCompleteItem(queueObj, response.body);
    }
    /**
     * @param {?} queueObj
     * @param {?} response
     * @return {?}
     */
    _uploadFailed(queueObj, response) {
        // update the FileQueueObject as errored
        queueObj.progress = 0;
        queueObj.status = FileQueueStatus.Error;
        queueObj.response = response;
        // this._queue.next(this._files);
    }
    /**
     * @param {?} options
     * @return {?}
     */
    setDefaults(options) {
        options.withCredentials = options.withCredentials || false;
        options.httpMethod = options.httpMethod || 'POST';
        options.authTokenPrefix = options.authTokenPrefix || 'Bearer';
        options.fieldName = options.fieldName || 'file';
    }
}
ImageUploaderService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
ImageUploaderService.ctorParameters = () => [
    { type: HttpClient, },
];
/** @nocollapse */ ImageUploaderService.ngInjectableDef = defineInjectable({ factory: function ImageUploaderService_Factory() { return new ImageUploaderService(inject(HttpClient)); }, token: ImageUploaderService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} url
 * @param {?} cb
 * @return {?}
 */
function createImage(url, cb) {
    const /** @type {?} */ image = new Image();
    image.onload = function () {
        cb(image);
    };
    image.src = url;
}
const /** @type {?} */ resizeAreaId = 'imageupload-resize-area';
/**
 * @return {?}
 */
function getResizeArea() {
    let /** @type {?} */ resizeArea = document.getElementById(resizeAreaId);
    if (!resizeArea) {
        resizeArea = document.createElement('canvas');
        resizeArea.id = resizeAreaId;
        resizeArea.style.display = 'none';
        document.body.appendChild(resizeArea);
    }
    return /** @type {?} */ (resizeArea);
}
/**
 * @param {?} origImage
 * @param {?=} __1
 * @return {?}
 */
function resizeImage(origImage, { resizeHeight, resizeWidth, resizeQuality = 0.7, resizeType = 'image/jpeg', resizeMode = 'fill' } = {}) {
    const /** @type {?} */ canvas = getResizeArea();
    let /** @type {?} */ height = origImage.height;
    let /** @type {?} */ width = origImage.width;
    let /** @type {?} */ offsetX = 0;
    let /** @type {?} */ offsetY = 0;
    if (resizeMode === 'fill') {
        // calculate the width and height, constraining the proportions
        if (width / height > resizeWidth / resizeHeight) {
            width = Math.round(height * resizeWidth / resizeHeight);
        }
        else {
            height = Math.round(width * resizeHeight / resizeWidth);
        }
        canvas.width = resizeWidth <= width ? resizeWidth : width;
        canvas.height = resizeHeight <= height ? resizeHeight : height;
        offsetX = origImage.width / 2 - width / 2;
        offsetY = origImage.height / 2 - height / 2;
        // draw image on canvas
        const /** @type {?} */ ctx = canvas.getContext('2d');
        ctx.drawImage(origImage, offsetX, offsetY, width, height, 0, 0, canvas.width, canvas.height);
    }
    else if (resizeMode === 'fit') {
        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > resizeWidth) {
                height = Math.round(height *= resizeWidth / width);
                width = resizeWidth;
            }
        }
        else {
            if (height > resizeHeight) {
                width = Math.round(width *= resizeHeight / height);
                height = resizeHeight;
            }
        }
        canvas.width = width;
        canvas.height = height;
        // draw image on canvas
        const /** @type {?} */ ctx = canvas.getContext('2d');
        ctx.drawImage(origImage, 0, 0, width, height);
    }
    else {
        throw new Error('Unknown resizeMode: ' + resizeMode);
    }
    // get the data from canvas as 70% jpg (or specified type).
    return canvas.toDataURL(resizeType, resizeQuality);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {number} */
const Status = {
    NotSelected: 0,
    Selected: 1,
    Uploading: 2,
    Loading: 3,
    Loaded: 4,
    Error: 5,
};
Status[Status.NotSelected] = "NotSelected";
Status[Status.Selected] = "Selected";
Status[Status.Uploading] = "Uploading";
Status[Status.Loading] = "Loading";
Status[Status.Loaded] = "Loaded";
Status[Status.Error] = "Error";
class ImageUploaderComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ImageUploaderModule {
}
ImageUploaderModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    HttpClientModule
                ],
                declarations: [ImageUploaderComponent],
                exports: [ImageUploaderComponent]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { ImageUploaderService, Status, ImageUploaderComponent, ImageUploaderModule, FileQueueObject };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltYWdlLXVwbG9hZGVyLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvbGliL2ZpbGUtcXVldWUtb2JqZWN0LnRzIiwibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvbGliL2ltYWdlLXVwbG9hZGVyLnNlcnZpY2UudHMiLCJuZzovL25neC1pbWFnZS11cGxvYWRlci9saWIvdXRpbHMudHMiLCJuZzovL25neC1pbWFnZS11cGxvYWRlci9saWIvaW1hZ2UtdXBsb2FkZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvbGliL2ltYWdlLXVwbG9hZGVyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwUmVzcG9uc2UsIEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IEZpbGVRdWV1ZVN0YXR1cyB9IGZyb20gJy4vZmlsZS1xdWV1ZS1zdGF0dXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpbGVRdWV1ZU9iamVjdCB7XHJcbiAgcHVibGljIGZpbGU6IGFueTtcclxuICBwdWJsaWMgc3RhdHVzOiBGaWxlUXVldWVTdGF0dXMgPSBGaWxlUXVldWVTdGF0dXMuUGVuZGluZztcclxuICBwdWJsaWMgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XHJcbiAgcHVibGljIHJlcXVlc3Q6IFN1YnNjcmlwdGlvbiA9IG51bGw7XHJcbiAgcHVibGljIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55PiB8IEh0dHBFcnJvclJlc3BvbnNlID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoZmlsZTogYW55KSB7XHJcbiAgICB0aGlzLmZpbGUgPSBmaWxlO1xyXG4gIH1cclxuXHJcbiAgLy8gYWN0aW9uc1xyXG4gIC8vIHB1YmxpYyB1cGxvYWQgPSAoKSA9PiB7IC8qIHNldCBpbiBzZXJ2aWNlICovIH07XHJcbiAgLy8gcHVibGljIGNhbmNlbCA9ICgpID0+IHsgLyogc2V0IGluIHNlcnZpY2UgKi8gfTtcclxuICAvLyBwdWJsaWMgcmVtb3ZlID0gKCkgPT4geyAvKiBzZXQgaW4gc2VydmljZSAqLyB9O1xyXG5cclxuICAvLyBzdGF0dXNlc1xyXG4gIHB1YmxpYyBpc1BlbmRpbmcgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlBlbmRpbmc7XHJcbiAgcHVibGljIGlzU3VjY2VzcyA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuU3VjY2VzcztcclxuICBwdWJsaWMgaXNFcnJvciA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuRXJyb3I7XHJcbiAgcHVibGljIGluUHJvZ3Jlc3MgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlByb2dyZXNzO1xyXG4gIHB1YmxpYyBpc1VwbG9hZGFibGUgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlBlbmRpbmcgfHwgdGhpcy5zdGF0dXMgPT09IEZpbGVRdWV1ZVN0YXR1cy5FcnJvcjtcclxufVxyXG4iLCJpbXBvcnQgeyBPYnNlcnZlciwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBSZXF1ZXN0LCBIdHRwRXZlbnRUeXBlLCBIdHRwUmVzcG9uc2UsIEh0dHBFcnJvclJlc3BvbnNlLCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7IEZpbGVRdWV1ZU9iamVjdCB9IGZyb20gJy4vZmlsZS1xdWV1ZS1vYmplY3QnO1xyXG5pbXBvcnQgeyBGaWxlUXVldWVTdGF0dXMgfSBmcm9tICcuL2ZpbGUtcXVldWUtc3RhdHVzJztcclxuaW1wb3J0IHsgRmlsZVVwbG9hZGVyT3B0aW9ucywgQ3JvcE9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWRlclNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHt9XHJcblxyXG4gIHVwbG9hZEZpbGUoZmlsZTogRmlsZSwgb3B0aW9uczogRmlsZVVwbG9hZGVyT3B0aW9ucywgY3JvcE9wdGlvbnM/OiBDcm9wT3B0aW9ucyk6IE9ic2VydmFibGU8RmlsZVF1ZXVlT2JqZWN0PiB7XHJcbiAgICB0aGlzLnNldERlZmF1bHRzKG9wdGlvbnMpO1xyXG5cclxuICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcclxuICAgIGZvcm0uYXBwZW5kKG9wdGlvbnMuZmllbGROYW1lLCBmaWxlLCBmaWxlLm5hbWUpO1xyXG5cclxuICAgIGlmIChjcm9wT3B0aW9ucykge1xyXG4gICAgICBmb3JtLmFwcGVuZCgnWCcsIGNyb3BPcHRpb25zLngudG9TdHJpbmcoKSk7XHJcbiAgICAgIGZvcm0uYXBwZW5kKCdZJywgY3JvcE9wdGlvbnMueS50b1N0cmluZygpKTtcclxuICAgICAgZm9ybS5hcHBlbmQoJ1dpZHRoJywgY3JvcE9wdGlvbnMud2lkdGgudG9TdHJpbmcoKSk7XHJcbiAgICAgIGZvcm0uYXBwZW5kKCdIZWlnaHQnLCBjcm9wT3B0aW9ucy5oZWlnaHQudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBsb2FkIGZpbGUgYW5kIHJlcG9ydCBwcm9ncmVzc1xyXG4gICAgY29uc3QgcmVxID0gbmV3IEh0dHBSZXF1ZXN0KCdQT1NUJywgb3B0aW9ucy51cGxvYWRVcmwsIGZvcm0sIHtcclxuICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWUsXHJcbiAgICAgIHdpdGhDcmVkZW50aWFsczogb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMsXHJcbiAgICAgIGhlYWRlcnM6IHRoaXMuX2J1aWxkSGVhZGVycyhvcHRpb25zKVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKG9icyA9PiB7XHJcbiAgICAgIGNvbnN0IHF1ZXVlT2JqID0gbmV3IEZpbGVRdWV1ZU9iamVjdChmaWxlKTtcclxuXHJcbiAgICAgIHF1ZXVlT2JqLnJlcXVlc3QgPSB0aGlzLmh0dHAucmVxdWVzdChyZXEpLnN1YnNjcmliZShcclxuICAgICAgICAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IEh0dHBFdmVudFR5cGUuVXBsb2FkUHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBsb2FkUHJvZ3Jlc3MocXVldWVPYmosIGV2ZW50KTtcclxuICAgICAgICAgICAgb2JzLm5leHQocXVldWVPYmopO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGxvYWRDb21wbGV0ZShxdWV1ZU9iaiwgZXZlbnQpO1xyXG4gICAgICAgICAgICBvYnMubmV4dChxdWV1ZU9iaik7XHJcbiAgICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycjogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIuZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgICAgICAvLyBBIGNsaWVudC1zaWRlIG9yIG5ldHdvcmsgZXJyb3Igb2NjdXJyZWQuIEhhbmRsZSBpdCBhY2NvcmRpbmdseS5cclxuICAgICAgICAgICAgdGhpcy5fdXBsb2FkRmFpbGVkKHF1ZXVlT2JqLCBlcnIpO1xyXG4gICAgICAgICAgICBvYnMubmV4dChxdWV1ZU9iaik7XHJcbiAgICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVGhlIGJhY2tlbmQgcmV0dXJuZWQgYW4gdW5zdWNjZXNzZnVsIHJlc3BvbnNlIGNvZGUuXHJcbiAgICAgICAgICAgIHRoaXMuX3VwbG9hZEZhaWxlZChxdWV1ZU9iaiwgZXJyKTtcclxuICAgICAgICAgICAgb2JzLm5leHQocXVldWVPYmopO1xyXG4gICAgICAgICAgICBvYnMuY29tcGxldGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEZpbGUodXJsOiBzdHJpbmcsIG9wdGlvbnM6IHsgYXV0aFRva2VuPzogc3RyaW5nLCBhdXRoVG9rZW5QcmVmaXg/OiBzdHJpbmcgfSk6IE9ic2VydmFibGU8RmlsZT4ge1xyXG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogT2JzZXJ2ZXI8RmlsZT4pID0+IHtcclxuICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmF1dGhUb2tlbikge1xyXG4gICAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsIGAke29wdGlvbnMuYXV0aFRva2VuUHJlZml4fSAke29wdGlvbnMuYXV0aFRva2VufWApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmh0dHAuZ2V0KHVybCwgeyByZXNwb25zZVR5cGU6ICdibG9iJywgaGVhZGVyczogaGVhZGVyc30pLnN1YnNjcmliZShyZXMgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShbcmVzXSwgJ2ZpbGVuYW1lJywgeyB0eXBlOiByZXMudHlwZSB9KTtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KGZpbGUpO1xyXG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyLnN0YXR1cyk7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2J1aWxkSGVhZGVycyhvcHRpb25zOiBGaWxlVXBsb2FkZXJPcHRpb25zKTogSHR0cEhlYWRlcnMge1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5hdXRoVG9rZW4pIHtcclxuICAgICAgaGVhZGVycyA9IGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgYCR7b3B0aW9ucy5hdXRoVG9rZW5QcmVmaXh9ICR7b3B0aW9ucy5hdXRoVG9rZW59YCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuY3VzdG9tSGVhZGVycykge1xyXG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zLmN1c3RvbUhlYWRlcnMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLmFwcGVuZChrZXksIG9wdGlvbnMuY3VzdG9tSGVhZGVyc1trZXldKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhlYWRlcnM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF91cGxvYWRQcm9ncmVzcyhxdWV1ZU9iajogRmlsZVF1ZXVlT2JqZWN0LCBldmVudDogYW55KSB7XHJcbiAgICAvLyB1cGRhdGUgdGhlIEZpbGVRdWV1ZU9iamVjdCB3aXRoIHRoZSBjdXJyZW50IHByb2dyZXNzXHJcbiAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgucm91bmQoMTAwICogZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpO1xyXG4gICAgcXVldWVPYmoucHJvZ3Jlc3MgPSBwcm9ncmVzcztcclxuICAgIHF1ZXVlT2JqLnN0YXR1cyA9IEZpbGVRdWV1ZVN0YXR1cy5Qcm9ncmVzcztcclxuICAgIC8vIHRoaXMuX3F1ZXVlLm5leHQodGhpcy5fZmlsZXMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdXBsb2FkQ29tcGxldGUocXVldWVPYmo6IEZpbGVRdWV1ZU9iamVjdCwgcmVzcG9uc2U6IEh0dHBSZXNwb25zZTxhbnk+KSB7XHJcbiAgICAvLyB1cGRhdGUgdGhlIEZpbGVRdWV1ZU9iamVjdCBhcyBjb21wbGV0ZWRcclxuICAgIHF1ZXVlT2JqLnByb2dyZXNzID0gMTAwO1xyXG4gICAgcXVldWVPYmouc3RhdHVzID0gRmlsZVF1ZXVlU3RhdHVzLlN1Y2Nlc3M7XHJcbiAgICBxdWV1ZU9iai5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgLy8gdGhpcy5fcXVldWUubmV4dCh0aGlzLl9maWxlcyk7XHJcbiAgICAvLyB0aGlzLm9uQ29tcGxldGVJdGVtKHF1ZXVlT2JqLCByZXNwb25zZS5ib2R5KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3VwbG9hZEZhaWxlZChxdWV1ZU9iajogRmlsZVF1ZXVlT2JqZWN0LCByZXNwb25zZTogSHR0cEVycm9yUmVzcG9uc2UpIHtcclxuICAgIC8vIHVwZGF0ZSB0aGUgRmlsZVF1ZXVlT2JqZWN0IGFzIGVycm9yZWRcclxuICAgIHF1ZXVlT2JqLnByb2dyZXNzID0gMDtcclxuICAgIHF1ZXVlT2JqLnN0YXR1cyA9IEZpbGVRdWV1ZVN0YXR1cy5FcnJvcjtcclxuICAgIHF1ZXVlT2JqLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAvLyB0aGlzLl9xdWV1ZS5uZXh0KHRoaXMuX2ZpbGVzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RGVmYXVsdHMob3B0aW9uczogRmlsZVVwbG9hZGVyT3B0aW9ucykge1xyXG4gICAgb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLndpdGhDcmVkZW50aWFscyB8fCBmYWxzZTtcclxuICAgIG9wdGlvbnMuaHR0cE1ldGhvZCA9IG9wdGlvbnMuaHR0cE1ldGhvZCB8fCAnUE9TVCc7XHJcbiAgICBvcHRpb25zLmF1dGhUb2tlblByZWZpeCA9IG9wdGlvbnMuYXV0aFRva2VuUHJlZml4IHx8ICdCZWFyZXInO1xyXG4gICAgb3B0aW9ucy5maWVsZE5hbWUgPSBvcHRpb25zLmZpZWxkTmFtZSB8fCAnZmlsZSc7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzaXplT3B0aW9uc30gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbWFnZSh1cmw6IHN0cmluZywgY2I6IChpOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB2b2lkKSB7XHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjYihpbWFnZSk7XHJcbiAgfTtcclxuICBpbWFnZS5zcmMgPSB1cmw7XHJcbn1cclxuXHJcbmNvbnN0IHJlc2l6ZUFyZWFJZCA9ICdpbWFnZXVwbG9hZC1yZXNpemUtYXJlYSc7XHJcblxyXG5mdW5jdGlvbiBnZXRSZXNpemVBcmVhKCkge1xyXG4gIGxldCByZXNpemVBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmVzaXplQXJlYUlkKTtcclxuICBpZiAoIXJlc2l6ZUFyZWEpIHtcclxuICAgIHJlc2l6ZUFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHJlc2l6ZUFyZWEuaWQgPSByZXNpemVBcmVhSWQ7XHJcbiAgICByZXNpemVBcmVhLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlc2l6ZUFyZWEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIDxIVE1MQ2FudmFzRWxlbWVudD5yZXNpemVBcmVhO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplSW1hZ2Uob3JpZ0ltYWdlOiBIVE1MSW1hZ2VFbGVtZW50LCB7XHJcbiAgcmVzaXplSGVpZ2h0LFxyXG4gIHJlc2l6ZVdpZHRoLFxyXG4gIHJlc2l6ZVF1YWxpdHkgPSAwLjcsXHJcbiAgcmVzaXplVHlwZSA9ICdpbWFnZS9qcGVnJyxcclxuICByZXNpemVNb2RlID0gJ2ZpbGwnXHJcbn06IFJlc2l6ZU9wdGlvbnMgPSB7fSkge1xyXG5cclxuICBjb25zdCBjYW52YXMgPSBnZXRSZXNpemVBcmVhKCk7XHJcblxyXG4gIGxldCBoZWlnaHQgPSBvcmlnSW1hZ2UuaGVpZ2h0O1xyXG4gIGxldCB3aWR0aCA9IG9yaWdJbWFnZS53aWR0aDtcclxuICBsZXQgb2Zmc2V0WCA9IDA7XHJcbiAgbGV0IG9mZnNldFkgPSAwO1xyXG5cclxuICBpZiAocmVzaXplTW9kZSA9PT0gJ2ZpbGwnKSB7XHJcbiAgICAvLyBjYWxjdWxhdGUgdGhlIHdpZHRoIGFuZCBoZWlnaHQsIGNvbnN0cmFpbmluZyB0aGUgcHJvcG9ydGlvbnNcclxuICAgIGlmICh3aWR0aCAvIGhlaWdodCA+IHJlc2l6ZVdpZHRoIC8gcmVzaXplSGVpZ2h0KSB7XHJcbiAgICAgIHdpZHRoID0gTWF0aC5yb3VuZChoZWlnaHQgKiByZXNpemVXaWR0aCAvIHJlc2l6ZUhlaWdodCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoZWlnaHQgPSBNYXRoLnJvdW5kKHdpZHRoICogcmVzaXplSGVpZ2h0IC8gcmVzaXplV2lkdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbnZhcy53aWR0aCA9IHJlc2l6ZVdpZHRoIDw9IHdpZHRoID8gcmVzaXplV2lkdGggOiB3aWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSByZXNpemVIZWlnaHQgPD0gaGVpZ2h0ID8gcmVzaXplSGVpZ2h0IDogaGVpZ2h0O1xyXG5cclxuICAgIG9mZnNldFggPSBvcmlnSW1hZ2Uud2lkdGggLyAyIC0gd2lkdGggLyAyO1xyXG4gICAgb2Zmc2V0WSA9IG9yaWdJbWFnZS5oZWlnaHQgLyAyIC0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAvLyBkcmF3IGltYWdlIG9uIGNhbnZhc1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjdHguZHJhd0ltYWdlKG9yaWdJbWFnZSwgb2Zmc2V0WCwgb2Zmc2V0WSwgd2lkdGgsIGhlaWdodCwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICB9IGVsc2UgaWYgKHJlc2l6ZU1vZGUgPT09ICdmaXQnKSB7XHJcbiAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgd2lkdGggYW5kIGhlaWdodCwgY29uc3RyYWluaW5nIHRoZSBwcm9wb3J0aW9uc1xyXG4gICAgICBpZiAod2lkdGggPiBoZWlnaHQpIHtcclxuICAgICAgICAgIGlmICh3aWR0aCA+IHJlc2l6ZVdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5yb3VuZChoZWlnaHQgKj0gcmVzaXplV2lkdGggLyB3aWR0aCk7XHJcbiAgICAgICAgICAgICAgd2lkdGggPSByZXNpemVXaWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChoZWlnaHQgPiByZXNpemVIZWlnaHQpIHtcclxuICAgICAgICAgICAgICB3aWR0aCA9IE1hdGgucm91bmQod2lkdGggKj0gcmVzaXplSGVpZ2h0IC8gaGVpZ2h0KTtcclxuICAgICAgICAgICAgICBoZWlnaHQgPSByZXNpemVIZWlnaHQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgLy8gZHJhdyBpbWFnZSBvbiBjYW52YXNcclxuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgIGN0eC5kcmF3SW1hZ2Uob3JpZ0ltYWdlLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHJlc2l6ZU1vZGU6ICcgKyByZXNpemVNb2RlKTtcclxuICB9XHJcblxyXG4gIC8vIGdldCB0aGUgZGF0YSBmcm9tIGNhbnZhcyBhcyA3MCUganBnIChvciBzcGVjaWZpZWQgdHlwZSkuXHJcbiAgcmV0dXJuIGNhbnZhcy50b0RhdGFVUkwocmVzaXplVHlwZSwgcmVzaXplUXVhbGl0eSk7XHJcbn1cclxuXHJcblxyXG4iLCJpbXBvcnQge1xyXG4gIENvbXBvbmVudCwgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0NoZWNrZWQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZixcclxuICBSZW5kZXJlciwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3RvclJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IENyb3BwZXIgZnJvbSAnY3JvcHBlcmpzJztcclxuXHJcbmltcG9ydCB7IEltYWdlVXBsb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9pbWFnZS11cGxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWRlck9wdGlvbnMsIEltYWdlUmVzdWx0LCBSZXNpemVPcHRpb25zLCBDcm9wT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IGNyZWF0ZUltYWdlLCByZXNpemVJbWFnZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBGaWxlUXVldWVPYmplY3QgfSBmcm9tICcuL2ZpbGUtcXVldWUtb2JqZWN0JztcclxuXHJcbmV4cG9ydCBlbnVtIFN0YXR1cyB7XHJcbiAgTm90U2VsZWN0ZWQsXHJcbiAgU2VsZWN0ZWQsXHJcbiAgVXBsb2FkaW5nLFxyXG4gIExvYWRpbmcsXHJcbiAgTG9hZGVkLFxyXG4gIEVycm9yXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWltYWdlLXVwbG9hZGVyJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJpbWFnZS1jb250YWluZXJcIj5cclxuICA8ZGl2IGNsYXNzPVwibWF0Y2gtcGFyZW50XCIgW25nU3dpdGNoXT1cInN0YXR1c1wiPlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5Ob3RTZWxlY3RlZFwiPlxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImFkZC1pbWFnZS1idG5cIiAoY2xpY2spPVwib25JbWFnZUNsaWNrZWQoKVwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPHAgY2xhc3M9XCJwbHVzXCI+KzwvcD5cclxuICAgICAgICAgICAgPHA+Q2xpY2sgaGVyZSB0byBhZGQgaW1hZ2U8L3A+XHJcbiAgICAgICAgICAgIDxwPk9yIGRyb3AgaW1hZ2UgaGVyZTwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RlZC1zdGF0dXMtd3JhcHBlciBtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5Mb2FkZWRcIj5cclxuICAgICAgPGltZyBbc3JjXT1cImltYWdlVGh1bWJuYWlsXCIgI2ltYWdlRWxlbWVudD5cclxuXHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicmVtb3ZlXCIgKGNsaWNrKT1cInJlbW92ZUltYWdlKClcIj7Dg8KXPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2VsZWN0ZWQtc3RhdHVzLXdyYXBwZXIgbWF0Y2gtcGFyZW50XCIgKm5nU3dpdGNoQ2FzZT1cInN0YXR1c0VudW0uU2VsZWN0ZWRcIj5cclxuICAgICAgPGltZyBbc3JjXT1cImltYWdlVGh1bWJuYWlsXCIgI2ltYWdlRWxlbWVudD5cclxuXHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicmVtb3ZlXCIgKGNsaWNrKT1cInJlbW92ZUltYWdlKClcIj7Dg8KXPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCJzdGF0dXNFbnVtLlVwbG9hZGluZ1wiPlxyXG4gICAgICA8aW1nIFthdHRyLnNyY109XCJpbWFnZVRodW1ibmFpbCA/IGltYWdlVGh1bWJuYWlsIDogbnVsbFwiIChjbGljayk9XCJvbkltYWdlQ2xpY2tlZCgpXCI+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImJhclwiIFtzdHlsZS53aWR0aF09XCJwcm9ncmVzcysnJSdcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwibWF0Y2gtcGFyZW50XCIgKm5nU3dpdGNoQ2FzZT1cInN0YXR1c0VudW0uTG9hZGluZ1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwic2stZmFkaW5nLWNpcmNsZVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUxIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUyIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUzIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU0IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU1IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU2IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU3IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU4IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU5IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUxMCBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMTEgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTEyIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5FcnJvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZXJyb3JcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZXJyb3ItbWVzc2FnZVwiPlxyXG4gICAgICAgICAgPHA+e3tlcnJvck1lc3NhZ2V9fTwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInJlbW92ZVwiIChjbGljayk9XCJkaXNtaXNzRXJyb3IoKVwiPsODwpc8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGlucHV0IHR5cGU9XCJmaWxlXCIgI2ZpbGVJbnB1dCAoY2hhbmdlKT1cIm9uRmlsZUNoYW5nZWQoKVwiPlxyXG4gIDxkaXYgY2xhc3M9XCJkcmFnLW92ZXJsYXlcIiBbaGlkZGVuXT1cInRydWVcIiAjZHJhZ092ZXJsYXk+PC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2A6aG9zdHtkaXNwbGF5OmJsb2NrfS5tYXRjaC1wYXJlbnR7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJX0uYWRkLWltYWdlLWJ0bnt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2ZvbnQtd2VpZ2h0OjcwMDtvcGFjaXR5Oi41O2JvcmRlcjowfS5hZGQtaW1hZ2UtYnRuOmhvdmVye29wYWNpdHk6Ljc7Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZC1jb2xvcjojZGRkO2JveC1zaGFkb3c6aW5zZXQgMCAwIDVweCByZ2JhKDAsMCwwLC4zKX0uYWRkLWltYWdlLWJ0biAucGx1c3tmb250LXNpemU6MzBweDtmb250LXdlaWdodDo0MDA7bWFyZ2luLWJvdHRvbTo1cHg7bWFyZ2luLXRvcDo1cHh9aW1ne2N1cnNvcjpwb2ludGVyO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7bWFyZ2luLXJpZ2h0Oi01MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO21heC13aWR0aDoxMDAlfS5pbWFnZS1jb250YWluZXJ7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kLWNvbG9yOiNmMWYxZjE7Ym94LXNoYWRvdzppbnNldCAwIDAgNXB4IHJnYmEoMCwwLDAsLjIpfS5yZW1vdmV7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7cmlnaHQ6MDt3aWR0aDo0MHB4O2hlaWdodDo0MHB4O2ZvbnQtc2l6ZToyNXB4O3RleHQtYWxpZ246Y2VudGVyO29wYWNpdHk6Ljg7Ym9yZGVyOjA7Y3Vyc29yOnBvaW50ZXJ9LnNlbGVjdGVkLXN0YXR1cy13cmFwcGVyPi5yZW1vdmU6aG92ZXJ7b3BhY2l0eTouNztiYWNrZ3JvdW5kLWNvbG9yOiNmZmZ9LmVycm9yIC5yZW1vdmV7b3BhY2l0eTouNX0uZXJyb3IgLnJlbW92ZTpob3ZlcntvcGFjaXR5Oi43fWlucHV0e2Rpc3BsYXk6bm9uZX0uZXJyb3J7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtib3JkZXI6MXB4IHNvbGlkICNlM2E1YTI7Y29sb3I6I2QyNzA2YjtiYWNrZ3JvdW5kLWNvbG9yOiNmYmYxZjA7cG9zaXRpb246cmVsYXRpdmU7dGV4dC1hbGlnbjpjZW50ZXI7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcn0uZXJyb3ItbWVzc2FnZXt3aWR0aDoxMDAlO2xpbmUtaGVpZ2h0OjE4cHh9LnByb2dyZXNzLWJhcntwb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MTAlO2xlZnQ6MTAlO3dpZHRoOjgwJTtoZWlnaHQ6NXB4O2JhY2tncm91bmQtY29sb3I6Z3JleTtvcGFjaXR5Oi45O292ZXJmbG93OmhpZGRlbn0uYmFye3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO2JhY2tncm91bmQtY29sb3I6I2E0YzYzOX0uZHJhZy1vdmVybGF5e3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JhY2tncm91bmQtY29sb3I6I2ZmMDtvcGFjaXR5Oi4zfS5zay1mYWRpbmctY2lyY2xle3dpZHRoOjQwcHg7aGVpZ2h0OjQwcHg7cG9zaXRpb246cmVsYXRpdmU7dG9wOjUwJTtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MH0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOmJlZm9yZXtjb250ZW50OicnO2Rpc3BsYXk6YmxvY2s7bWFyZ2luOjAgYXV0bzt3aWR0aDoxNSU7aGVpZ2h0OjE1JTtiYWNrZ3JvdW5kLWNvbG9yOiMzMzM7Ym9yZGVyLXJhZGl1czoxMDAlOy13ZWJraXQtYW5pbWF0aW9uOjEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYm90aCBzay1jaXJjbGVGYWRlRGVsYXk7YW5pbWF0aW9uOjEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYm90aCBzay1jaXJjbGVGYWRlRGVsYXl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTJ7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDMwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlM3std2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNjBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoNjBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU0ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSg5MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDEyMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgxMjBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU2ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgxNTBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMTUwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlN3std2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDE4MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTh7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDIxMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgyMTBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU5ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgyNDBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMjQwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTB7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDI3MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgyNzBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMwMGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTEyey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMzBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMzMwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LTEuMXM7YW5pbWF0aW9uLWRlbGF5Oi0xLjFzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUzOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotMXM7YW5pbWF0aW9uLWRlbGF5Oi0xc30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNDpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS45czthbmltYXRpb24tZGVsYXk6LS45c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS44czthbmltYXRpb24tZGVsYXk6LS44c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS43czthbmltYXRpb24tZGVsYXk6LS43c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNzpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS42czthbmltYXRpb24tZGVsYXk6LS42c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlODpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS41czthbmltYXRpb24tZGVsYXk6LS41c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS40czthbmltYXRpb24tZGVsYXk6LS40c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTA6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uM3M7YW5pbWF0aW9uLWRlbGF5Oi0uM3N9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTExOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotLjJzO2FuaW1hdGlvbi1kZWxheTotLjJzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS4xczthbmltYXRpb24tZGVsYXk6LS4xc31ALXdlYmtpdC1rZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5ezAlLDEwMCUsMzkle29wYWNpdHk6MH00MCV7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHNrLWNpcmNsZUZhZGVEZWxheXswJSwxMDAlLDM5JXtvcGFjaXR5OjB9NDAle29wYWNpdHk6MX19YF0sXHJcbiAgaG9zdDoge1xyXG4gICAgJ1tzdHlsZS53aWR0aF0nOiAndGh1bWJuYWlsV2lkdGggKyBcInB4XCInLFxyXG4gICAgJ1tzdHlsZS5oZWlnaHRdJzogJ3RodW1ibmFpbEhlaWdodCArIFwicHhcIidcclxuICB9LFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gSW1hZ2VVcGxvYWRlckNvbXBvbmVudCksXHJcbiAgICAgIG11bHRpOiB0cnVlXHJcbiAgICB9XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdDaGVja2VkLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcbiAgc3RhdHVzRW51bSA9IFN0YXR1cztcclxuICBfc3RhdHVzOiBTdGF0dXMgPSBTdGF0dXMuTm90U2VsZWN0ZWQ7XHJcblxyXG4gIHRodW1ibmFpbFdpZHRoID0gMTUwO1xyXG4gIHRodW1ibmFpbEhlaWdodCA9IDE1MDtcclxuICBfaW1hZ2VUaHVtYm5haWw6IGFueTtcclxuICBfZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgcHJvZ3Jlc3M6IG51bWJlcjtcclxuICBvcmlnSW1hZ2VXaWR0aDogbnVtYmVyO1xyXG4gIG9yZ2lJbWFnZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICBjcm9wcGVyOiBDcm9wcGVyID0gdW5kZWZpbmVkO1xyXG4gIGZpbGVUb1VwbG9hZDogRmlsZTtcclxuXHJcbiAgQFZpZXdDaGlsZCgnaW1hZ2VFbGVtZW50JykgaW1hZ2VFbGVtZW50OiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2ZpbGVJbnB1dCcpIGZpbGVJbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnZHJhZ092ZXJsYXknKSBkcmFnT3ZlcmxheUVsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcbiAgQElucHV0KCkgb3B0aW9uczogSW1hZ2VVcGxvYWRlck9wdGlvbnM7XHJcbiAgQE91dHB1dCgpIHVwbG9hZDogRXZlbnRFbWl0dGVyPEZpbGVRdWV1ZU9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPEZpbGVRdWV1ZU9iamVjdD4oKTtcclxuICBAT3V0cHV0KCkgc3RhdHVzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8U3RhdHVzPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3RhdHVzPigpO1xyXG5cclxuICBwcm9wYWdhdGVDaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcixcclxuICAgIHByaXZhdGUgdXBsb2FkZXI6IEltYWdlVXBsb2FkZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHsgfVxyXG5cclxuICBnZXQgaW1hZ2VUaHVtYm5haWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5faW1hZ2VUaHVtYm5haWw7XHJcbiAgfVxyXG5cclxuICBzZXQgaW1hZ2VUaHVtYm5haWwodmFsdWUpIHtcclxuICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gdmFsdWU7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSh0aGlzLl9pbWFnZVRodW1ibmFpbCk7XHJcblxyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuU2VsZWN0ZWQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Ob3RTZWxlY3RlZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBlcnJvck1lc3NhZ2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZXJyb3JNZXNzYWdlO1xyXG4gIH1cclxuXHJcbiAgc2V0IGVycm9yTWVzc2FnZSh2YWx1ZSkge1xyXG4gICAgdGhpcy5fZXJyb3JNZXNzYWdlID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLkVycm9yO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTm90U2VsZWN0ZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgc3RhdHVzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcclxuICB9XHJcblxyXG4gIHNldCBzdGF0dXModmFsdWUpIHtcclxuICAgIHRoaXMuX3N0YXR1cyA9IHZhbHVlO1xyXG4gICAgdGhpcy5zdGF0dXNDaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICB0aGlzLmxvYWRBbmRSZXNpemUodmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLk5vdFNlbGVjdGVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UgPSBmbjtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKCkge31cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGh1bWJuYWlsV2lkdGgpIHtcclxuICAgICAgICB0aGlzLnRodW1ibmFpbFdpZHRoID0gdGhpcy5vcHRpb25zLnRodW1ibmFpbFdpZHRoO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy50aHVtYm5haWxIZWlnaHQgPSB0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVzaXplT25Mb2FkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucmVzaXplT25Mb2FkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9VcGxvYWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5hdXRvVXBsb2FkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNyb3BFbmFibGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuY3JvcEVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvVXBsb2FkICYmIHRoaXMub3B0aW9ucy5jcm9wRW5hYmxlZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYXV0b1VwbG9hZCBhbmQgY3JvcEVuYWJsZWQgY2Fubm90IGJlIGVuYWJsZWQgc2ltdWx0YW5lb3VzbHknKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY3JvcEVuYWJsZWQgJiYgdGhpcy5pbWFnZUVsZW1lbnQgJiYgdGhpcy5maWxlVG9VcGxvYWQgJiYgIXRoaXMuY3JvcHBlcikge1xyXG4gICAgICB0aGlzLmNyb3BwZXIgPSBuZXcgQ3JvcHBlcih0aGlzLmltYWdlRWxlbWVudC5uYXRpdmVFbGVtZW50LCB7XHJcbiAgICAgICAgdmlld01vZGU6IDEsXHJcbiAgICAgICAgYXNwZWN0UmF0aW86IHRoaXMub3B0aW9ucy5jcm9wQXNwZWN0UmF0aW8gPyB0aGlzLm9wdGlvbnMuY3JvcEFzcGVjdFJhdGlvIDogbnVsbFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMuY3JvcHBlcikge1xyXG4gICAgICB0aGlzLmNyb3BwZXIuZGVzdHJveSgpO1xyXG4gICAgICB0aGlzLmNyb3BwZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZEFuZFJlc2l6ZSh1cmw6IHN0cmluZykge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTG9hZGluZztcclxuXHJcbiAgICB0aGlzLnVwbG9hZGVyLmdldEZpbGUodXJsLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShmaWxlID0+IHtcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXNpemVPbkxvYWQpIHtcclxuICAgICAgICAvLyB0aHVtYm5haWxcclxuICAgICAgICBjb25zdCByZXN1bHQ6IEltYWdlUmVzdWx0ID0ge1xyXG4gICAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICAgIHVybDogVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzaXplKHJlc3VsdCkudGhlbihyID0+IHtcclxuICAgICAgICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gci5yZXNpemVkLmRhdGFVUkw7XHJcbiAgICAgICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Mb2FkZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJbWFnZVJlc3VsdCA9IHtcclxuICAgICAgICAgIGZpbGU6IG51bGwsXHJcbiAgICAgICAgICB1cmw6IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVUb0RhdGFVUkwoZmlsZSwgcmVzdWx0KS50aGVuKHIgPT4ge1xyXG4gICAgICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSByLmRhdGFVUkw7XHJcbiAgICAgICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Mb2FkZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBlcnJvciB8fCAnRXJyb3Igd2hpbGUgZ2V0dGluZyBhbiBpbWFnZSc7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uSW1hZ2VDbGlja2VkKCkge1xyXG4gICAgdGhpcy5yZW5kZXJlci5pbnZva2VFbGVtZW50TWV0aG9kKHRoaXMuZmlsZUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY2xpY2snKTtcclxuICB9XHJcblxyXG4gIG9uRmlsZUNoYW5nZWQoKSB7XHJcbiAgICBjb25zdCBmaWxlID0gdGhpcy5maWxlSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZmlsZXNbMF07XHJcbiAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmFsaWRhdGVBbmRVcGxvYWQoZmlsZSk7XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZUFuZFVwbG9hZChmaWxlOiBGaWxlKSB7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShudWxsKTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcykge1xyXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcy5zb21lKGFsbG93ZWRUeXBlID0+IGZpbGUudHlwZSA9PT0gYWxsb3dlZFR5cGUpKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSAnT25seSB0aGVzZSBpbWFnZSB0eXBlcyBhcmUgYWxsb3dlZDogJyArIHRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcy5qb2luKCcsICcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm1heEltYWdlU2l6ZSkge1xyXG4gICAgICBpZiAoZmlsZS5zaXplID4gdGhpcy5vcHRpb25zLm1heEltYWdlU2l6ZSAqIDEwMjQgKiAxMDI0KSB7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBgSW1hZ2UgbXVzdCBub3QgYmUgbGFyZ2VyIHRoYW4gJHt0aGlzLm9wdGlvbnMubWF4SW1hZ2VTaXplfSBNQmA7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5maWxlVG9VcGxvYWQgPSBmaWxlO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmF1dG9VcGxvYWQpIHtcclxuICAgICAgdGhpcy51cGxvYWRJbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRodW1ibmFpbFxyXG4gICAgY29uc3QgcmVzdWx0OiBJbWFnZVJlc3VsdCA9IHtcclxuICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgdXJsOiBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVzaXplKHJlc3VsdCkudGhlbihyID0+IHtcclxuICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSByLnJlc2l6ZWQuZGF0YVVSTDtcclxuICAgICAgdGhpcy5vcmlnSW1hZ2VXaWR0aCA9IHIud2lkdGg7XHJcbiAgICAgIHRoaXMub3JnaUltYWdlSGVpZ2h0ID0gci5oZWlnaHQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zICYmICF0aGlzLm9wdGlvbnMuYXV0b1VwbG9hZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLlNlbGVjdGVkO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwbG9hZEltYWdlKCkge1xyXG4gICAgdGhpcy5wcm9ncmVzcyA9IDA7XHJcbiAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5VcGxvYWRpbmc7XHJcblxyXG4gICAgbGV0IGNyb3BPcHRpb25zOiBDcm9wT3B0aW9ucztcclxuXHJcbiAgICBpZiAodGhpcy5jcm9wcGVyKSB7XHJcbiAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5vcmlnSW1hZ2VXaWR0aCAvIHRoaXMuY3JvcHBlci5nZXRJbWFnZURhdGEoKS5uYXR1cmFsV2lkdGg7XHJcbiAgICAgIGNvbnN0IGNyb3BEYXRhID0gdGhpcy5jcm9wcGVyLmdldERhdGEoKTtcclxuXHJcbiAgICAgIGNyb3BPcHRpb25zID0ge1xyXG4gICAgICAgIHg6IE1hdGgucm91bmQoY3JvcERhdGEueCAqIHNjYWxlKSxcclxuICAgICAgICB5OiBNYXRoLnJvdW5kKGNyb3BEYXRhLnkgKiBzY2FsZSksXHJcbiAgICAgICAgd2lkdGg6IE1hdGgucm91bmQoY3JvcERhdGEud2lkdGggKiBzY2FsZSksXHJcbiAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGNyb3BEYXRhLmhlaWdodCAqIHNjYWxlKVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgLy8gY29uc3QgcXVldWVPYmogPSB0aGlzLnVwbG9hZGVyLnVwbG9hZEZpbGUodGhpcy5maWxlVG9VcGxvYWQsIHRoaXMub3B0aW9ucywgY3JvcE9wdGlvbnMpO1xyXG5cclxuICAgIC8vIGZpbGUgcHJvZ3Jlc3NcclxuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkRmlsZSh0aGlzLmZpbGVUb1VwbG9hZCwgdGhpcy5vcHRpb25zLCBjcm9wT3B0aW9ucykuc3Vic2NyaWJlKGZpbGUgPT4ge1xyXG4gICAgICB0aGlzLnByb2dyZXNzID0gZmlsZS5wcm9ncmVzcztcclxuXHJcbiAgICAgIGlmIChmaWxlLmlzRXJyb3IoKSkge1xyXG4gICAgICAgIGlmIChmaWxlLnJlc3BvbnNlLnN0YXR1cyB8fCBmaWxlLnJlc3BvbnNlLnN0YXR1c1RleHQpIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gYCR7ZmlsZS5yZXNwb25zZS5zdGF0dXN9OiAke2ZpbGUucmVzcG9uc2Uuc3RhdHVzVGV4dH1gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9ICdFcnJvciB3aGlsZSB1cGxvYWRpbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvbiBzb21lIHVwbG9hZCBlcnJvcnMgY2hhbmdlIGRldGVjdGlvbiBkb2VzIG5vdCB3b3JrLCBzbyB3ZSBhcmUgZm9yY2luZyBtYW51YWxseVxyXG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWZpbGUuaW5Qcm9ncmVzcygpKSB7XHJcbiAgICAgICAgLy8gbm90aWZ5IHRoYXQgdmFsdWUgd2FzIGNoYW5nZWQgb25seSB3aGVuIGltYWdlIHdhcyB1cGxvYWRlZCBhbmQgbm8gZXJyb3JcclxuICAgICAgICBpZiAoZmlsZS5pc1N1Y2Nlc3MoKSkge1xyXG4gICAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UodGhpcy5faW1hZ2VUaHVtYm5haWwpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuU2VsZWN0ZWQ7XHJcbiAgICAgICAgICB0aGlzLmZpbGVUb1VwbG9hZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBsb2FkLmVtaXQoZmlsZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlSW1hZ2UoKSB7XHJcbiAgICB0aGlzLmZpbGVJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZSA9IG51bGw7XHJcbiAgICB0aGlzLmltYWdlVGh1bWJuYWlsID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGlmICh0aGlzLmNyb3BwZXIpIHtcclxuICAgICAgdGhpcy5jcm9wcGVyLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5jcm9wcGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpc21pc3NFcnJvcigpIHtcclxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5yZW1vdmVJbWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pIGRyb3AoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgIGlmICghZS5kYXRhVHJhbnNmZXIgfHwgIWUuZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52YWxpZGF0ZUFuZFVwbG9hZChlLmRhdGFUcmFuc2Zlci5maWxlc1swXSk7XHJcbiAgICB0aGlzLnVwZGF0ZURyYWdPdmVybGF5U3R5bGVzKGZhbHNlKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pIGRyYWdlbnRlcihlOiBEcmFnRXZlbnQpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnb3ZlcicsIFsnJGV2ZW50J10pIGRyYWdvdmVyKGU6IERyYWdFdmVudCkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIHRoaXMudXBkYXRlRHJhZ092ZXJsYXlTdHlsZXModHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKSBkcmFnbGVhdmUoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgdGhpcy51cGRhdGVEcmFnT3ZlcmxheVN0eWxlcyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZURyYWdPdmVybGF5U3R5bGVzKGlzRHJhZ092ZXI6IGJvb2xlYW4pIHtcclxuICAgIC8vIFRPRE86IGZpbmQgYSB3YXkgdGhhdCBkb2VzIG5vdCB0cmlnZ2VyIGRyYWdsZWF2ZSB3aGVuIGRpc3BsYXlpbmcgb3ZlcmxheVxyXG4gICAgLy8gaWYgKGlzRHJhZ092ZXIpIHtcclxuICAgIC8vICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLmRyYWdPdmVybGF5RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgLy8gfSBlbHNlIHtcclxuICAgIC8vICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLmRyYWdPdmVybGF5RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlc2l6ZShyZXN1bHQ6IEltYWdlUmVzdWx0KTogUHJvbWlzZTxJbWFnZVJlc3VsdD4ge1xyXG4gICAgY29uc3QgcmVzaXplT3B0aW9uczogUmVzaXplT3B0aW9ucyA9IHtcclxuICAgICAgcmVzaXplSGVpZ2h0OiB0aGlzLnRodW1ibmFpbEhlaWdodCxcclxuICAgICAgcmVzaXplV2lkdGg6IHRoaXMudGh1bWJuYWlsV2lkdGgsXHJcbiAgICAgIHJlc2l6ZVR5cGU6IHJlc3VsdC5maWxlLnR5cGUsXHJcbiAgICAgIHJlc2l6ZU1vZGU6IHRoaXMub3B0aW9ucy50aHVtYm5haWxSZXNpemVNb2RlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBjcmVhdGVJbWFnZShyZXN1bHQudXJsLCBpbWFnZSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YVVybCA9IHJlc2l6ZUltYWdlKGltYWdlLCByZXNpemVPcHRpb25zKTtcclxuXHJcbiAgICAgICAgcmVzdWx0LndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgcmVzdWx0LmhlaWdodCA9IGltYWdlLmhlaWdodDtcclxuICAgICAgICByZXN1bHQucmVzaXplZCA9IHtcclxuICAgICAgICAgIGRhdGFVUkw6IGRhdGFVcmwsXHJcbiAgICAgICAgICB0eXBlOiB0aGlzLmdldFR5cGUoZGF0YVVybClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFR5cGUoZGF0YVVybDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZGF0YVVybC5tYXRjaCgvOiguK1xcLy4rOykvKVsxXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZmlsZVRvRGF0YVVSTChmaWxlOiBGaWxlLCByZXN1bHQ6IEltYWdlUmVzdWx0KTogUHJvbWlzZTxJbWFnZVJlc3VsdD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHJlc3VsdC5kYXRhVVJMID0gcmVhZGVyLnJlc3VsdDtcclxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9pbWFnZS11cGxvYWRlci5jb21wb25lbnQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtJbWFnZVVwbG9hZGVyQ29tcG9uZW50XSxcclxuICBleHBvcnRzOiBbSW1hZ2VVcGxvYWRlckNvbXBvbmVudF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkZXJNb2R1bGUgeyB9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQTs7OztJQVNFLFlBQVksSUFBUztzQkFMWSxlQUFlLENBQUMsT0FBTzt3QkFDOUIsQ0FBQzt1QkFDSSxJQUFJO3dCQUNzQixJQUFJO3lCQVkxQyxNQUFNLElBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLE9BQU87eUJBQzdDLE1BQU0sSUFBSSxDQUFDLE1BQU0sS0FBSyxlQUFlLENBQUMsT0FBTzt1QkFDL0MsTUFBTSxJQUFJLENBQUMsTUFBTSxLQUFLLGVBQWUsQ0FBQyxLQUFLOzBCQUN4QyxNQUFNLElBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLFFBQVE7NEJBQzVDLE1BQU0sSUFBSSxDQUFDLE1BQU0sS0FBSyxlQUFlLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFN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