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
var FileQueueStatus = {
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
var FileQueueObject = /** @class */ (function () {
    function FileQueueObject(file) {
        var _this = this;
        this.status = FileQueueStatus.Pending;
        this.progress = 0;
        this.request = null;
        this.response = null;
        this.isPending = function () { return _this.status === FileQueueStatus.Pending; };
        this.isSuccess = function () { return _this.status === FileQueueStatus.Success; };
        this.isError = function () { return _this.status === FileQueueStatus.Error; };
        this.inProgress = function () { return _this.status === FileQueueStatus.Progress; };
        this.isUploadable = function () { return _this.status === FileQueueStatus.Pending || _this.status === FileQueueStatus.Error; };
        this.file = file;
    }
    return FileQueueObject;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ImageUploaderService = /** @class */ (function () {
    function ImageUploaderService(http) {
        this.http = http;
    }
    /**
     * @param {?} file
     * @param {?} options
     * @param {?=} cropOptions
     * @return {?}
     */
    ImageUploaderService.prototype.uploadFile = /**
     * @param {?} file
     * @param {?} options
     * @param {?=} cropOptions
     * @return {?}
     */
    function (file, options, cropOptions) {
        var _this = this;
        this.setDefaults(options);
        var /** @type {?} */ form = new FormData();
        form.append(options.fieldName, file, file.name);
        if (cropOptions) {
            form.append('X', cropOptions.x.toString());
            form.append('Y', cropOptions.y.toString());
            form.append('Width', cropOptions.width.toString());
            form.append('Height', cropOptions.height.toString());
        }
        // upload file and report progress
        var /** @type {?} */ req = new HttpRequest('POST', options.uploadUrl, form, {
            reportProgress: true,
            withCredentials: options.withCredentials,
            headers: this._buildHeaders(options)
        });
        return Observable.create(function (obs) {
            var /** @type {?} */ queueObj = new FileQueueObject(file);
            queueObj.request = _this.http.request(req).subscribe(function (event) {
                if (event.type === HttpEventType.UploadProgress) {
                    _this._uploadProgress(queueObj, event);
                    obs.next(queueObj);
                }
                else if (event instanceof HttpResponse) {
                    _this._uploadComplete(queueObj, event);
                    obs.next(queueObj);
                    obs.complete();
                }
            }, function (err) {
                if (err.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    // A client-side or network error occurred. Handle it accordingly.
                    _this._uploadFailed(queueObj, err);
                    obs.next(queueObj);
                    obs.complete();
                }
                else {
                    // The backend returned an unsuccessful response code.
                    // The backend returned an unsuccessful response code.
                    _this._uploadFailed(queueObj, err);
                    obs.next(queueObj);
                    obs.complete();
                }
            });
        });
    };
    /**
     * @param {?} url
     * @param {?} options
     * @return {?}
     */
    ImageUploaderService.prototype.getFile = /**
     * @param {?} url
     * @param {?} options
     * @return {?}
     */
    function (url, options) {
        var _this = this;
        return Observable.create(function (observer) {
            var /** @type {?} */ headers = new HttpHeaders();
            if (options.authToken) {
                headers = headers.append('Authorization', options.authTokenPrefix + " " + options.authToken);
            }
            _this.http.get(url, { responseType: 'blob', headers: headers }).subscribe(function (res) {
                var /** @type {?} */ file = new File([res], 'filename', { type: res.type });
                observer.next(file);
                observer.complete();
            }, function (err) {
                observer.error(err.status);
                observer.complete();
            });
        });
    };
    /**
     * @param {?} options
     * @return {?}
     */
    ImageUploaderService.prototype._buildHeaders = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        var /** @type {?} */ headers = new HttpHeaders();
        if (options.authToken) {
            headers = headers.append('Authorization', options.authTokenPrefix + " " + options.authToken);
        }
        if (options.customHeaders) {
            Object.keys(options.customHeaders).forEach(function (key) {
                headers = headers.append(key, options.customHeaders[key]);
            });
        }
        return headers;
    };
    /**
     * @param {?} queueObj
     * @param {?} event
     * @return {?}
     */
    ImageUploaderService.prototype._uploadProgress = /**
     * @param {?} queueObj
     * @param {?} event
     * @return {?}
     */
    function (queueObj, event) {
        // update the FileQueueObject with the current progress
        var /** @type {?} */ progress = Math.round(100 * event.loaded / event.total);
        queueObj.progress = progress;
        queueObj.status = FileQueueStatus.Progress;
        // this._queue.next(this._files);
    };
    /**
     * @param {?} queueObj
     * @param {?} response
     * @return {?}
     */
    ImageUploaderService.prototype._uploadComplete = /**
     * @param {?} queueObj
     * @param {?} response
     * @return {?}
     */
    function (queueObj, response) {
        // update the FileQueueObject as completed
        queueObj.progress = 100;
        queueObj.status = FileQueueStatus.Success;
        queueObj.response = response;
        // this._queue.next(this._files);
        // this.onCompleteItem(queueObj, response.body);
    };
    /**
     * @param {?} queueObj
     * @param {?} response
     * @return {?}
     */
    ImageUploaderService.prototype._uploadFailed = /**
     * @param {?} queueObj
     * @param {?} response
     * @return {?}
     */
    function (queueObj, response) {
        // update the FileQueueObject as errored
        queueObj.progress = 0;
        queueObj.status = FileQueueStatus.Error;
        queueObj.response = response;
        // this._queue.next(this._files);
    };
    /**
     * @param {?} options
     * @return {?}
     */
    ImageUploaderService.prototype.setDefaults = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        options.withCredentials = options.withCredentials || false;
        options.httpMethod = options.httpMethod || 'POST';
        options.authTokenPrefix = options.authTokenPrefix || 'Bearer';
        options.fieldName = options.fieldName || 'file';
    };
    ImageUploaderService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    ImageUploaderService.ctorParameters = function () { return [
        { type: HttpClient, },
    ]; };
    /** @nocollapse */ ImageUploaderService.ngInjectableDef = defineInjectable({ factory: function ImageUploaderService_Factory() { return new ImageUploaderService(inject(HttpClient)); }, token: ImageUploaderService, providedIn: "root" });
    return ImageUploaderService;
}());

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
    var /** @type {?} */ image = new Image();
    image.onload = function () {
        cb(image);
    };
    image.src = url;
}
var /** @type {?} */ resizeAreaId = 'imageupload-resize-area';
/**
 * @return {?}
 */
function getResizeArea() {
    var /** @type {?} */ resizeArea = document.getElementById(resizeAreaId);
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
function resizeImage(origImage, _a) {
    var _b = _a === void 0 ? {} : _a, resizeHeight = _b.resizeHeight, resizeWidth = _b.resizeWidth, _c = _b.resizeQuality, resizeQuality = _c === void 0 ? 0.7 : _c, _d = _b.resizeType, resizeType = _d === void 0 ? 'image/jpeg' : _d, _e = _b.resizeMode, resizeMode = _e === void 0 ? 'fill' : _e;
    var /** @type {?} */ canvas = getResizeArea();
    var /** @type {?} */ height = origImage.height;
    var /** @type {?} */ width = origImage.width;
    var /** @type {?} */ offsetX = 0;
    var /** @type {?} */ offsetY = 0;
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
        var /** @type {?} */ ctx = canvas.getContext('2d');
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
        var /** @type {?} */ ctx = canvas.getContext('2d');
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
var Status = {
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
var ImageUploaderComponent = /** @class */ (function () {
    function ImageUploaderComponent(renderer, uploader, changeDetector) {
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
        this.propagateChange = function (_) { };
    }
    Object.defineProperty(ImageUploaderComponent.prototype, "imageThumbnail", {
        get: /**
         * @return {?}
         */
        function () {
            return this._imageThumbnail;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._imageThumbnail = value;
            this.propagateChange(this._imageThumbnail);
            if (value !== undefined) {
                this.status = Status.Selected;
            }
            else {
                this.status = Status.NotSelected;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageUploaderComponent.prototype, "errorMessage", {
        get: /**
         * @return {?}
         */
        function () {
            return this._errorMessage;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._errorMessage = value;
            if (value) {
                this.status = Status.Error;
            }
            else {
                this.status = Status.NotSelected;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageUploaderComponent.prototype, "status", {
        get: /**
         * @return {?}
         */
        function () {
            return this._status;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._status = value;
            this.statusChange.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} value
     * @return {?}
     */
    ImageUploaderComponent.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value) {
            this.loadAndResize(value);
        }
        else {
            this._imageThumbnail = undefined;
            this.status = Status.NotSelected;
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    ImageUploaderComponent.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.propagateChange = fn;
    };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.registerOnTouched = /**
     * @return {?}
     */
    function () { };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.ngAfterViewChecked = /**
     * @return {?}
     */
    function () {
        if (this.options && this.options.cropEnabled && this.imageElement && this.fileToUpload && !this.cropper) {
            this.cropper = new Cropper(this.imageElement.nativeElement, {
                viewMode: 1,
                aspectRatio: this.options.cropAspectRatio ? this.options.cropAspectRatio : null
            });
        }
    };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
    };
    /**
     * @param {?} url
     * @return {?}
     */
    ImageUploaderComponent.prototype.loadAndResize = /**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        var _this = this;
        this.status = Status.Loading;
        this.uploader.getFile(url, this.options).subscribe(function (file) {
            if (_this.options.resizeOnLoad) {
                // thumbnail
                var /** @type {?} */ result = {
                    file: file,
                    url: URL.createObjectURL(file)
                };
                _this.resize(result).then(function (r) {
                    _this._imageThumbnail = r.resized.dataURL;
                    _this.status = Status.Loaded;
                });
            }
            else {
                var /** @type {?} */ result = {
                    file: null,
                    url: null
                };
                _this.fileToDataURL(file, result).then(function (r) {
                    _this._imageThumbnail = r.dataURL;
                    _this.status = Status.Loaded;
                });
            }
        }, function (error) {
            _this.errorMessage = error || 'Error while getting an image';
        });
    };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.onImageClicked = /**
     * @return {?}
     */
    function () {
        this.renderer.invokeElementMethod(this.fileInputElement.nativeElement, 'click');
    };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.onFileChanged = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ file = this.fileInputElement.nativeElement.files[0];
        if (!file) {
            return;
        }
        this.validateAndUpload(file);
    };
    /**
     * @param {?} file
     * @return {?}
     */
    ImageUploaderComponent.prototype.validateAndUpload = /**
     * @param {?} file
     * @return {?}
     */
    function (file) {
        var _this = this;
        this.propagateChange(null);
        if (this.options && this.options.allowedImageTypes) {
            if (!this.options.allowedImageTypes.some(function (allowedType) { return file.type === allowedType; })) {
                this.errorMessage = 'Only these image types are allowed: ' + this.options.allowedImageTypes.join(', ');
                return;
            }
        }
        if (this.options && this.options.maxImageSize) {
            if (file.size > this.options.maxImageSize * 1024 * 1024) {
                this.errorMessage = "Image must not be larger than " + this.options.maxImageSize + " MB";
                return;
            }
        }
        this.fileToUpload = file;
        if (this.options && this.options.autoUpload) {
            this.uploadImage();
        }
        // thumbnail
        var /** @type {?} */ result = {
            file: file,
            url: URL.createObjectURL(file)
        };
        this.resize(result).then(function (r) {
            _this._imageThumbnail = r.resized.dataURL;
            _this.origImageWidth = r.width;
            _this.orgiImageHeight = r.height;
            if (_this.options && !_this.options.autoUpload) {
                _this.status = Status.Selected;
            }
        });
    };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.uploadImage = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.progress = 0;
        this.status = Status.Uploading;
        var /** @type {?} */ cropOptions;
        if (this.cropper) {
            var /** @type {?} */ scale = this.origImageWidth / this.cropper.getImageData().naturalWidth;
            var /** @type {?} */ cropData = this.cropper.getData();
            cropOptions = {
                x: Math.round(cropData.x * scale),
                y: Math.round(cropData.y * scale),
                width: Math.round(cropData.width * scale),
                height: Math.round(cropData.height * scale)
            };
        }
        // const queueObj = this.uploader.uploadFile(this.fileToUpload, this.options, cropOptions);
        // file progress
        this.uploader.uploadFile(this.fileToUpload, this.options, cropOptions).subscribe(function (file) {
            _this.progress = file.progress;
            if (file.isError()) {
                if (file.response.status || file.response.statusText) {
                    _this.errorMessage = file.response.status + ": " + file.response.statusText;
                }
                else {
                    _this.errorMessage = 'Error while uploading';
                }
                // on some upload errors change detection does not work, so we are forcing manually
                // on some upload errors change detection does not work, so we are forcing manually
                _this.changeDetector.detectChanges();
            }
            if (!file.inProgress()) {
                // notify that value was changed only when image was uploaded and no error
                if (file.isSuccess()) {
                    _this.propagateChange(_this._imageThumbnail);
                    _this.status = Status.Selected;
                    _this.fileToUpload = undefined;
                }
                _this.upload.emit(file);
            }
        });
    };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.removeImage = /**
     * @return {?}
     */
    function () {
        this.fileInputElement.nativeElement.value = null;
        this.imageThumbnail = undefined;
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
    };
    /**
     * @return {?}
     */
    ImageUploaderComponent.prototype.dismissError = /**
     * @return {?}
     */
    function () {
        this.errorMessage = undefined;
        this.removeImage();
    };
    /**
     * @param {?} e
     * @return {?}
     */
    ImageUploaderComponent.prototype.drop = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer || !e.dataTransfer.files.length) {
            return;
        }
        this.validateAndUpload(e.dataTransfer.files[0]);
        this.updateDragOverlayStyles(false);
    };
    /**
     * @param {?} e
     * @return {?}
     */
    ImageUploaderComponent.prototype.dragenter = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    /**
     * @param {?} e
     * @return {?}
     */
    ImageUploaderComponent.prototype.dragover = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.updateDragOverlayStyles(true);
    };
    /**
     * @param {?} e
     * @return {?}
     */
    ImageUploaderComponent.prototype.dragleave = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.updateDragOverlayStyles(false);
    };
    /**
     * @param {?} isDragOver
     * @return {?}
     */
    ImageUploaderComponent.prototype.updateDragOverlayStyles = /**
     * @param {?} isDragOver
     * @return {?}
     */
    function (isDragOver) {
        // TODO: find a way that does not trigger dragleave when displaying overlay
        // if (isDragOver) {
        //  this.renderer.setElementStyle(this.dragOverlayElement.nativeElement, 'display', 'block');
        // } else {
        //  this.renderer.setElementStyle(this.dragOverlayElement.nativeElement, 'display', 'none');
        // }
    };
    /**
     * @param {?} result
     * @return {?}
     */
    ImageUploaderComponent.prototype.resize = /**
     * @param {?} result
     * @return {?}
     */
    function (result) {
        var _this = this;
        var /** @type {?} */ resizeOptions = {
            resizeHeight: this.thumbnailHeight,
            resizeWidth: this.thumbnailWidth,
            resizeType: result.file.type,
            resizeMode: this.options.thumbnailResizeMode
        };
        return new Promise(function (resolve) {
            createImage(result.url, function (image) {
                var /** @type {?} */ dataUrl = resizeImage(image, resizeOptions);
                result.width = image.width;
                result.height = image.height;
                result.resized = {
                    dataURL: dataUrl,
                    type: _this.getType(dataUrl)
                };
                resolve(result);
            });
        });
    };
    /**
     * @param {?} dataUrl
     * @return {?}
     */
    ImageUploaderComponent.prototype.getType = /**
     * @param {?} dataUrl
     * @return {?}
     */
    function (dataUrl) {
        return dataUrl.match(/:(.+\/.+;)/)[1];
    };
    /**
     * @param {?} file
     * @param {?} result
     * @return {?}
     */
    ImageUploaderComponent.prototype.fileToDataURL = /**
     * @param {?} file
     * @param {?} result
     * @return {?}
     */
    function (file, result) {
        return new Promise(function (resolve) {
            var /** @type {?} */ reader = new FileReader();
            reader.onload = function (e) {
                result.dataURL = reader.result;
                resolve(result);
            };
            reader.readAsDataURL(file);
        });
    };
    ImageUploaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-image-uploader',
                    template: "<div class=\"image-container\">\n  <div class=\"match-parent\" [ngSwitch]=\"status\">\n\n    <div class=\"match-parent\" *ngSwitchCase=\"statusEnum.NotSelected\">\n      <button type=\"button\" class=\"add-image-btn\" (click)=\"onImageClicked()\">\n          <div>\n            <p class=\"plus\">+</p>\n            <p>Click here to add image</p>\n            <p>Or drop image here</p>\n          </div>\n      </button>\n    </div>\n\n    <div class=\"selected-status-wrapper match-parent\" *ngSwitchCase=\"statusEnum.Loaded\">\n      <img [src]=\"imageThumbnail\" #imageElement>\n\n      <button type=\"button\" class=\"remove\" (click)=\"removeImage()\">\u00D7</button>\n    </div>\n\n    <div class=\"selected-status-wrapper match-parent\" *ngSwitchCase=\"statusEnum.Selected\">\n      <img [src]=\"imageThumbnail\" #imageElement>\n\n      <button type=\"button\" class=\"remove\" (click)=\"removeImage()\">\u00D7</button>\n    </div>\n\n    <div *ngSwitchCase=\"statusEnum.Uploading\">\n      <img [attr.src]=\"imageThumbnail ? imageThumbnail : null\" (click)=\"onImageClicked()\">\n\n      <div class=\"progress-bar\">\n        <div class=\"bar\" [style.width]=\"progress+'%'\"></div>\n      </div>\n    </div>\n\n    <div class=\"match-parent\" *ngSwitchCase=\"statusEnum.Loading\">\n      <div class=\"sk-fading-circle\">\n        <div class=\"sk-circle1 sk-circle\"></div>\n        <div class=\"sk-circle2 sk-circle\"></div>\n        <div class=\"sk-circle3 sk-circle\"></div>\n        <div class=\"sk-circle4 sk-circle\"></div>\n        <div class=\"sk-circle5 sk-circle\"></div>\n        <div class=\"sk-circle6 sk-circle\"></div>\n        <div class=\"sk-circle7 sk-circle\"></div>\n        <div class=\"sk-circle8 sk-circle\"></div>\n        <div class=\"sk-circle9 sk-circle\"></div>\n        <div class=\"sk-circle10 sk-circle\"></div>\n        <div class=\"sk-circle11 sk-circle\"></div>\n        <div class=\"sk-circle12 sk-circle\"></div>\n      </div>\n    </div>\n\n    <div class=\"match-parent\" *ngSwitchCase=\"statusEnum.Error\">\n      <div class=\"error\">\n        <div class=\"error-message\">\n          <p>{{errorMessage}}</p>\n        </div>\n        <button type=\"button\" class=\"remove\" (click)=\"dismissError()\">\u00D7</button>\n      </div>\n    </div>\n  </div>\n\n  <input type=\"file\" #fileInput (change)=\"onFileChanged()\">\n  <div class=\"drag-overlay\" [hidden]=\"true\" #dragOverlay></div>\n</div>\n",
                    styles: [":host{display:block}.match-parent{width:100%;height:100%}.add-image-btn{width:100%;height:100%;font-weight:700;opacity:.5;border:0}.add-image-btn:hover{opacity:.7;cursor:pointer;background-color:#ddd;box-shadow:inset 0 0 5px rgba(0,0,0,.3)}.add-image-btn .plus{font-size:30px;font-weight:400;margin-bottom:5px;margin-top:5px}img{cursor:pointer;position:absolute;top:50%;left:50%;margin-right:-50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);max-width:100%}.image-container{width:100%;height:100%;position:relative;display:inline-block;background-color:#f1f1f1;box-shadow:inset 0 0 5px rgba(0,0,0,.2)}.remove{position:absolute;top:0;right:0;width:40px;height:40px;font-size:25px;text-align:center;opacity:.8;border:0;cursor:pointer}.selected-status-wrapper>.remove:hover{opacity:.7;background-color:#fff}.error .remove{opacity:.5}.error .remove:hover{opacity:.7}input{display:none}.error{width:100%;height:100%;border:1px solid #e3a5a2;color:#d2706b;background-color:#fbf1f0;position:relative;text-align:center;display:flex;align-items:center}.error-message{width:100%;line-height:18px}.progress-bar{position:absolute;bottom:10%;left:10%;width:80%;height:5px;background-color:grey;opacity:.9;overflow:hidden}.bar{position:absolute;height:100%;background-color:#a4c639}.drag-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background-color:#ff0;opacity:.3}.sk-fading-circle{width:40px;height:40px;position:relative;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:'';display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;-webkit-animation:1.2s ease-in-out infinite both sk-circleFadeDelay;animation:1.2s ease-in-out infinite both sk-circleFadeDelay}.sk-fading-circle .sk-circle2{-webkit-transform:rotate(30deg);transform:rotate(30deg)}.sk-fading-circle .sk-circle3{-webkit-transform:rotate(60deg);transform:rotate(60deg)}.sk-fading-circle .sk-circle4{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.sk-fading-circle .sk-circle5{-webkit-transform:rotate(120deg);transform:rotate(120deg)}.sk-fading-circle .sk-circle6{-webkit-transform:rotate(150deg);transform:rotate(150deg)}.sk-fading-circle .sk-circle7{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.sk-fading-circle .sk-circle8{-webkit-transform:rotate(210deg);transform:rotate(210deg)}.sk-fading-circle .sk-circle9{-webkit-transform:rotate(240deg);transform:rotate(240deg)}.sk-fading-circle .sk-circle10{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.sk-fading-circle .sk-circle11{-webkit-transform:rotate(300deg);transform:rotate(300deg)}.sk-fading-circle .sk-circle12{-webkit-transform:rotate(330deg);transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.sk-fading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}@keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}"],
                    host: {
                        '[style.width]': 'thumbnailWidth + "px"',
                        '[style.height]': 'thumbnailHeight + "px"'
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return ImageUploaderComponent; }),
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    ImageUploaderComponent.ctorParameters = function () { return [
        { type: Renderer, },
        { type: ImageUploaderService, },
        { type: ChangeDetectorRef, },
    ]; };
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
    return ImageUploaderComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ImageUploaderModule = /** @class */ (function () {
    function ImageUploaderModule() {
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
    return ImageUploaderModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { ImageUploaderService, Status, ImageUploaderComponent, ImageUploaderModule, FileQueueObject };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltYWdlLXVwbG9hZGVyLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvbGliL2ZpbGUtcXVldWUtb2JqZWN0LnRzIiwibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvbGliL2ltYWdlLXVwbG9hZGVyLnNlcnZpY2UudHMiLCJuZzovL25neC1pbWFnZS11cGxvYWRlci9saWIvdXRpbHMudHMiLCJuZzovL25neC1pbWFnZS11cGxvYWRlci9saWIvaW1hZ2UtdXBsb2FkZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvbGliL2ltYWdlLXVwbG9hZGVyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwUmVzcG9uc2UsIEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IEZpbGVRdWV1ZVN0YXR1cyB9IGZyb20gJy4vZmlsZS1xdWV1ZS1zdGF0dXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpbGVRdWV1ZU9iamVjdCB7XHJcbiAgcHVibGljIGZpbGU6IGFueTtcclxuICBwdWJsaWMgc3RhdHVzOiBGaWxlUXVldWVTdGF0dXMgPSBGaWxlUXVldWVTdGF0dXMuUGVuZGluZztcclxuICBwdWJsaWMgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XHJcbiAgcHVibGljIHJlcXVlc3Q6IFN1YnNjcmlwdGlvbiA9IG51bGw7XHJcbiAgcHVibGljIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55PiB8IEh0dHBFcnJvclJlc3BvbnNlID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoZmlsZTogYW55KSB7XHJcbiAgICB0aGlzLmZpbGUgPSBmaWxlO1xyXG4gIH1cclxuXHJcbiAgLy8gYWN0aW9uc1xyXG4gIC8vIHB1YmxpYyB1cGxvYWQgPSAoKSA9PiB7IC8qIHNldCBpbiBzZXJ2aWNlICovIH07XHJcbiAgLy8gcHVibGljIGNhbmNlbCA9ICgpID0+IHsgLyogc2V0IGluIHNlcnZpY2UgKi8gfTtcclxuICAvLyBwdWJsaWMgcmVtb3ZlID0gKCkgPT4geyAvKiBzZXQgaW4gc2VydmljZSAqLyB9O1xyXG5cclxuICAvLyBzdGF0dXNlc1xyXG4gIHB1YmxpYyBpc1BlbmRpbmcgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlBlbmRpbmc7XHJcbiAgcHVibGljIGlzU3VjY2VzcyA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuU3VjY2VzcztcclxuICBwdWJsaWMgaXNFcnJvciA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuRXJyb3I7XHJcbiAgcHVibGljIGluUHJvZ3Jlc3MgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlByb2dyZXNzO1xyXG4gIHB1YmxpYyBpc1VwbG9hZGFibGUgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlBlbmRpbmcgfHwgdGhpcy5zdGF0dXMgPT09IEZpbGVRdWV1ZVN0YXR1cy5FcnJvcjtcclxufVxyXG4iLCJpbXBvcnQgeyBPYnNlcnZlciwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBSZXF1ZXN0LCBIdHRwRXZlbnRUeXBlLCBIdHRwUmVzcG9uc2UsIEh0dHBFcnJvclJlc3BvbnNlLCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7IEZpbGVRdWV1ZU9iamVjdCB9IGZyb20gJy4vZmlsZS1xdWV1ZS1vYmplY3QnO1xyXG5pbXBvcnQgeyBGaWxlUXVldWVTdGF0dXMgfSBmcm9tICcuL2ZpbGUtcXVldWUtc3RhdHVzJztcclxuaW1wb3J0IHsgRmlsZVVwbG9hZGVyT3B0aW9ucywgQ3JvcE9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWRlclNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHt9XHJcblxyXG4gIHVwbG9hZEZpbGUoZmlsZTogRmlsZSwgb3B0aW9uczogRmlsZVVwbG9hZGVyT3B0aW9ucywgY3JvcE9wdGlvbnM/OiBDcm9wT3B0aW9ucyk6IE9ic2VydmFibGU8RmlsZVF1ZXVlT2JqZWN0PiB7XHJcbiAgICB0aGlzLnNldERlZmF1bHRzKG9wdGlvbnMpO1xyXG5cclxuICAgIGNvbnN0IGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcclxuICAgIGZvcm0uYXBwZW5kKG9wdGlvbnMuZmllbGROYW1lLCBmaWxlLCBmaWxlLm5hbWUpO1xyXG5cclxuICAgIGlmIChjcm9wT3B0aW9ucykge1xyXG4gICAgICBmb3JtLmFwcGVuZCgnWCcsIGNyb3BPcHRpb25zLngudG9TdHJpbmcoKSk7XHJcbiAgICAgIGZvcm0uYXBwZW5kKCdZJywgY3JvcE9wdGlvbnMueS50b1N0cmluZygpKTtcclxuICAgICAgZm9ybS5hcHBlbmQoJ1dpZHRoJywgY3JvcE9wdGlvbnMud2lkdGgudG9TdHJpbmcoKSk7XHJcbiAgICAgIGZvcm0uYXBwZW5kKCdIZWlnaHQnLCBjcm9wT3B0aW9ucy5oZWlnaHQudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBsb2FkIGZpbGUgYW5kIHJlcG9ydCBwcm9ncmVzc1xyXG4gICAgY29uc3QgcmVxID0gbmV3IEh0dHBSZXF1ZXN0KCdQT1NUJywgb3B0aW9ucy51cGxvYWRVcmwsIGZvcm0sIHtcclxuICAgICAgcmVwb3J0UHJvZ3Jlc3M6IHRydWUsXHJcbiAgICAgIHdpdGhDcmVkZW50aWFsczogb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMsXHJcbiAgICAgIGhlYWRlcnM6IHRoaXMuX2J1aWxkSGVhZGVycyhvcHRpb25zKVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKG9icyA9PiB7XHJcbiAgICAgIGNvbnN0IHF1ZXVlT2JqID0gbmV3IEZpbGVRdWV1ZU9iamVjdChmaWxlKTtcclxuXHJcbiAgICAgIHF1ZXVlT2JqLnJlcXVlc3QgPSB0aGlzLmh0dHAucmVxdWVzdChyZXEpLnN1YnNjcmliZShcclxuICAgICAgICAoZXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09IEh0dHBFdmVudFR5cGUuVXBsb2FkUHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBsb2FkUHJvZ3Jlc3MocXVldWVPYmosIGV2ZW50KTtcclxuICAgICAgICAgICAgb2JzLm5leHQocXVldWVPYmopO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGxvYWRDb21wbGV0ZShxdWV1ZU9iaiwgZXZlbnQpO1xyXG4gICAgICAgICAgICBvYnMubmV4dChxdWV1ZU9iaik7XHJcbiAgICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycjogSHR0cEVycm9yUmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIuZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgICAgICAvLyBBIGNsaWVudC1zaWRlIG9yIG5ldHdvcmsgZXJyb3Igb2NjdXJyZWQuIEhhbmRsZSBpdCBhY2NvcmRpbmdseS5cclxuICAgICAgICAgICAgdGhpcy5fdXBsb2FkRmFpbGVkKHF1ZXVlT2JqLCBlcnIpO1xyXG4gICAgICAgICAgICBvYnMubmV4dChxdWV1ZU9iaik7XHJcbiAgICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVGhlIGJhY2tlbmQgcmV0dXJuZWQgYW4gdW5zdWNjZXNzZnVsIHJlc3BvbnNlIGNvZGUuXHJcbiAgICAgICAgICAgIHRoaXMuX3VwbG9hZEZhaWxlZChxdWV1ZU9iaiwgZXJyKTtcclxuICAgICAgICAgICAgb2JzLm5leHQocXVldWVPYmopO1xyXG4gICAgICAgICAgICBvYnMuY29tcGxldGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEZpbGUodXJsOiBzdHJpbmcsIG9wdGlvbnM6IHsgYXV0aFRva2VuPzogc3RyaW5nLCBhdXRoVG9rZW5QcmVmaXg/OiBzdHJpbmcgfSk6IE9ic2VydmFibGU8RmlsZT4ge1xyXG4gICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogT2JzZXJ2ZXI8RmlsZT4pID0+IHtcclxuICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmF1dGhUb2tlbikge1xyXG4gICAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsIGAke29wdGlvbnMuYXV0aFRva2VuUHJlZml4fSAke29wdGlvbnMuYXV0aFRva2VufWApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmh0dHAuZ2V0KHVybCwgeyByZXNwb25zZVR5cGU6ICdibG9iJywgaGVhZGVyczogaGVhZGVyc30pLnN1YnNjcmliZShyZXMgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShbcmVzXSwgJ2ZpbGVuYW1lJywgeyB0eXBlOiByZXMudHlwZSB9KTtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KGZpbGUpO1xyXG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgIH0sIGVyciA9PiB7XHJcbiAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyLnN0YXR1cyk7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2J1aWxkSGVhZGVycyhvcHRpb25zOiBGaWxlVXBsb2FkZXJPcHRpb25zKTogSHR0cEhlYWRlcnMge1xyXG4gICAgbGV0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5hdXRoVG9rZW4pIHtcclxuICAgICAgaGVhZGVycyA9IGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgYCR7b3B0aW9ucy5hdXRoVG9rZW5QcmVmaXh9ICR7b3B0aW9ucy5hdXRoVG9rZW59YCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuY3VzdG9tSGVhZGVycykge1xyXG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zLmN1c3RvbUhlYWRlcnMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLmFwcGVuZChrZXksIG9wdGlvbnMuY3VzdG9tSGVhZGVyc1trZXldKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhlYWRlcnM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF91cGxvYWRQcm9ncmVzcyhxdWV1ZU9iajogRmlsZVF1ZXVlT2JqZWN0LCBldmVudDogYW55KSB7XHJcbiAgICAvLyB1cGRhdGUgdGhlIEZpbGVRdWV1ZU9iamVjdCB3aXRoIHRoZSBjdXJyZW50IHByb2dyZXNzXHJcbiAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgucm91bmQoMTAwICogZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwpO1xyXG4gICAgcXVldWVPYmoucHJvZ3Jlc3MgPSBwcm9ncmVzcztcclxuICAgIHF1ZXVlT2JqLnN0YXR1cyA9IEZpbGVRdWV1ZVN0YXR1cy5Qcm9ncmVzcztcclxuICAgIC8vIHRoaXMuX3F1ZXVlLm5leHQodGhpcy5fZmlsZXMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdXBsb2FkQ29tcGxldGUocXVldWVPYmo6IEZpbGVRdWV1ZU9iamVjdCwgcmVzcG9uc2U6IEh0dHBSZXNwb25zZTxhbnk+KSB7XHJcbiAgICAvLyB1cGRhdGUgdGhlIEZpbGVRdWV1ZU9iamVjdCBhcyBjb21wbGV0ZWRcclxuICAgIHF1ZXVlT2JqLnByb2dyZXNzID0gMTAwO1xyXG4gICAgcXVldWVPYmouc3RhdHVzID0gRmlsZVF1ZXVlU3RhdHVzLlN1Y2Nlc3M7XHJcbiAgICBxdWV1ZU9iai5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgLy8gdGhpcy5fcXVldWUubmV4dCh0aGlzLl9maWxlcyk7XHJcbiAgICAvLyB0aGlzLm9uQ29tcGxldGVJdGVtKHF1ZXVlT2JqLCByZXNwb25zZS5ib2R5KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3VwbG9hZEZhaWxlZChxdWV1ZU9iajogRmlsZVF1ZXVlT2JqZWN0LCByZXNwb25zZTogSHR0cEVycm9yUmVzcG9uc2UpIHtcclxuICAgIC8vIHVwZGF0ZSB0aGUgRmlsZVF1ZXVlT2JqZWN0IGFzIGVycm9yZWRcclxuICAgIHF1ZXVlT2JqLnByb2dyZXNzID0gMDtcclxuICAgIHF1ZXVlT2JqLnN0YXR1cyA9IEZpbGVRdWV1ZVN0YXR1cy5FcnJvcjtcclxuICAgIHF1ZXVlT2JqLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAvLyB0aGlzLl9xdWV1ZS5uZXh0KHRoaXMuX2ZpbGVzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RGVmYXVsdHMob3B0aW9uczogRmlsZVVwbG9hZGVyT3B0aW9ucykge1xyXG4gICAgb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgPSBvcHRpb25zLndpdGhDcmVkZW50aWFscyB8fCBmYWxzZTtcclxuICAgIG9wdGlvbnMuaHR0cE1ldGhvZCA9IG9wdGlvbnMuaHR0cE1ldGhvZCB8fCAnUE9TVCc7XHJcbiAgICBvcHRpb25zLmF1dGhUb2tlblByZWZpeCA9IG9wdGlvbnMuYXV0aFRva2VuUHJlZml4IHx8ICdCZWFyZXInO1xyXG4gICAgb3B0aW9ucy5maWVsZE5hbWUgPSBvcHRpb25zLmZpZWxkTmFtZSB8fCAnZmlsZSc7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UmVzaXplT3B0aW9uc30gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbWFnZSh1cmw6IHN0cmluZywgY2I6IChpOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB2b2lkKSB7XHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjYihpbWFnZSk7XHJcbiAgfTtcclxuICBpbWFnZS5zcmMgPSB1cmw7XHJcbn1cclxuXHJcbmNvbnN0IHJlc2l6ZUFyZWFJZCA9ICdpbWFnZXVwbG9hZC1yZXNpemUtYXJlYSc7XHJcblxyXG5mdW5jdGlvbiBnZXRSZXNpemVBcmVhKCkge1xyXG4gIGxldCByZXNpemVBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmVzaXplQXJlYUlkKTtcclxuICBpZiAoIXJlc2l6ZUFyZWEpIHtcclxuICAgIHJlc2l6ZUFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHJlc2l6ZUFyZWEuaWQgPSByZXNpemVBcmVhSWQ7XHJcbiAgICByZXNpemVBcmVhLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlc2l6ZUFyZWEpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIDxIVE1MQ2FudmFzRWxlbWVudD5yZXNpemVBcmVhO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplSW1hZ2Uob3JpZ0ltYWdlOiBIVE1MSW1hZ2VFbGVtZW50LCB7XHJcbiAgcmVzaXplSGVpZ2h0LFxyXG4gIHJlc2l6ZVdpZHRoLFxyXG4gIHJlc2l6ZVF1YWxpdHkgPSAwLjcsXHJcbiAgcmVzaXplVHlwZSA9ICdpbWFnZS9qcGVnJyxcclxuICByZXNpemVNb2RlID0gJ2ZpbGwnXHJcbn06IFJlc2l6ZU9wdGlvbnMgPSB7fSkge1xyXG5cclxuICBjb25zdCBjYW52YXMgPSBnZXRSZXNpemVBcmVhKCk7XHJcblxyXG4gIGxldCBoZWlnaHQgPSBvcmlnSW1hZ2UuaGVpZ2h0O1xyXG4gIGxldCB3aWR0aCA9IG9yaWdJbWFnZS53aWR0aDtcclxuICBsZXQgb2Zmc2V0WCA9IDA7XHJcbiAgbGV0IG9mZnNldFkgPSAwO1xyXG5cclxuICBpZiAocmVzaXplTW9kZSA9PT0gJ2ZpbGwnKSB7XHJcbiAgICAvLyBjYWxjdWxhdGUgdGhlIHdpZHRoIGFuZCBoZWlnaHQsIGNvbnN0cmFpbmluZyB0aGUgcHJvcG9ydGlvbnNcclxuICAgIGlmICh3aWR0aCAvIGhlaWdodCA+IHJlc2l6ZVdpZHRoIC8gcmVzaXplSGVpZ2h0KSB7XHJcbiAgICAgIHdpZHRoID0gTWF0aC5yb3VuZChoZWlnaHQgKiByZXNpemVXaWR0aCAvIHJlc2l6ZUhlaWdodCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoZWlnaHQgPSBNYXRoLnJvdW5kKHdpZHRoICogcmVzaXplSGVpZ2h0IC8gcmVzaXplV2lkdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbnZhcy53aWR0aCA9IHJlc2l6ZVdpZHRoIDw9IHdpZHRoID8gcmVzaXplV2lkdGggOiB3aWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSByZXNpemVIZWlnaHQgPD0gaGVpZ2h0ID8gcmVzaXplSGVpZ2h0IDogaGVpZ2h0O1xyXG5cclxuICAgIG9mZnNldFggPSBvcmlnSW1hZ2Uud2lkdGggLyAyIC0gd2lkdGggLyAyO1xyXG4gICAgb2Zmc2V0WSA9IG9yaWdJbWFnZS5oZWlnaHQgLyAyIC0gaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAvLyBkcmF3IGltYWdlIG9uIGNhbnZhc1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjdHguZHJhd0ltYWdlKG9yaWdJbWFnZSwgb2Zmc2V0WCwgb2Zmc2V0WSwgd2lkdGgsIGhlaWdodCwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICB9IGVsc2UgaWYgKHJlc2l6ZU1vZGUgPT09ICdmaXQnKSB7XHJcbiAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgd2lkdGggYW5kIGhlaWdodCwgY29uc3RyYWluaW5nIHRoZSBwcm9wb3J0aW9uc1xyXG4gICAgICBpZiAod2lkdGggPiBoZWlnaHQpIHtcclxuICAgICAgICAgIGlmICh3aWR0aCA+IHJlc2l6ZVdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5yb3VuZChoZWlnaHQgKj0gcmVzaXplV2lkdGggLyB3aWR0aCk7XHJcbiAgICAgICAgICAgICAgd2lkdGggPSByZXNpemVXaWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChoZWlnaHQgPiByZXNpemVIZWlnaHQpIHtcclxuICAgICAgICAgICAgICB3aWR0aCA9IE1hdGgucm91bmQod2lkdGggKj0gcmVzaXplSGVpZ2h0IC8gaGVpZ2h0KTtcclxuICAgICAgICAgICAgICBoZWlnaHQgPSByZXNpemVIZWlnaHQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgLy8gZHJhdyBpbWFnZSBvbiBjYW52YXNcclxuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgIGN0eC5kcmF3SW1hZ2Uob3JpZ0ltYWdlLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHJlc2l6ZU1vZGU6ICcgKyByZXNpemVNb2RlKTtcclxuICB9XHJcblxyXG4gIC8vIGdldCB0aGUgZGF0YSBmcm9tIGNhbnZhcyBhcyA3MCUganBnIChvciBzcGVjaWZpZWQgdHlwZSkuXHJcbiAgcmV0dXJuIGNhbnZhcy50b0RhdGFVUkwocmVzaXplVHlwZSwgcmVzaXplUXVhbGl0eSk7XHJcbn1cclxuXHJcblxyXG4iLCJpbXBvcnQge1xyXG4gIENvbXBvbmVudCwgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0NoZWNrZWQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZixcclxuICBSZW5kZXJlciwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3RvclJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IENyb3BwZXIgZnJvbSAnY3JvcHBlcmpzJztcclxuXHJcbmltcG9ydCB7IEltYWdlVXBsb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9pbWFnZS11cGxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWRlck9wdGlvbnMsIEltYWdlUmVzdWx0LCBSZXNpemVPcHRpb25zLCBDcm9wT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IGNyZWF0ZUltYWdlLCByZXNpemVJbWFnZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBGaWxlUXVldWVPYmplY3QgfSBmcm9tICcuL2ZpbGUtcXVldWUtb2JqZWN0JztcclxuXHJcbmV4cG9ydCBlbnVtIFN0YXR1cyB7XHJcbiAgTm90U2VsZWN0ZWQsXHJcbiAgU2VsZWN0ZWQsXHJcbiAgVXBsb2FkaW5nLFxyXG4gIExvYWRpbmcsXHJcbiAgTG9hZGVkLFxyXG4gIEVycm9yXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWltYWdlLXVwbG9hZGVyJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJpbWFnZS1jb250YWluZXJcIj5cclxuICA8ZGl2IGNsYXNzPVwibWF0Y2gtcGFyZW50XCIgW25nU3dpdGNoXT1cInN0YXR1c1wiPlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5Ob3RTZWxlY3RlZFwiPlxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImFkZC1pbWFnZS1idG5cIiAoY2xpY2spPVwib25JbWFnZUNsaWNrZWQoKVwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPHAgY2xhc3M9XCJwbHVzXCI+KzwvcD5cclxuICAgICAgICAgICAgPHA+Q2xpY2sgaGVyZSB0byBhZGQgaW1hZ2U8L3A+XHJcbiAgICAgICAgICAgIDxwPk9yIGRyb3AgaW1hZ2UgaGVyZTwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzZWxlY3RlZC1zdGF0dXMtd3JhcHBlciBtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5Mb2FkZWRcIj5cclxuICAgICAgPGltZyBbc3JjXT1cImltYWdlVGh1bWJuYWlsXCIgI2ltYWdlRWxlbWVudD5cclxuXHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicmVtb3ZlXCIgKGNsaWNrKT1cInJlbW92ZUltYWdlKClcIj7Dg8KXPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2VsZWN0ZWQtc3RhdHVzLXdyYXBwZXIgbWF0Y2gtcGFyZW50XCIgKm5nU3dpdGNoQ2FzZT1cInN0YXR1c0VudW0uU2VsZWN0ZWRcIj5cclxuICAgICAgPGltZyBbc3JjXT1cImltYWdlVGh1bWJuYWlsXCIgI2ltYWdlRWxlbWVudD5cclxuXHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicmVtb3ZlXCIgKGNsaWNrKT1cInJlbW92ZUltYWdlKClcIj7Dg8KXPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2ICpuZ1N3aXRjaENhc2U9XCJzdGF0dXNFbnVtLlVwbG9hZGluZ1wiPlxyXG4gICAgICA8aW1nIFthdHRyLnNyY109XCJpbWFnZVRodW1ibmFpbCA/IGltYWdlVGh1bWJuYWlsIDogbnVsbFwiIChjbGljayk9XCJvbkltYWdlQ2xpY2tlZCgpXCI+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImJhclwiIFtzdHlsZS53aWR0aF09XCJwcm9ncmVzcysnJSdcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwibWF0Y2gtcGFyZW50XCIgKm5nU3dpdGNoQ2FzZT1cInN0YXR1c0VudW0uTG9hZGluZ1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwic2stZmFkaW5nLWNpcmNsZVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUxIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUyIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUzIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU0IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU1IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU2IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU3IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU4IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGU5IHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUxMCBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMTEgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTEyIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJtYXRjaC1wYXJlbnRcIiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5FcnJvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZXJyb3JcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZXJyb3ItbWVzc2FnZVwiPlxyXG4gICAgICAgICAgPHA+e3tlcnJvck1lc3NhZ2V9fTwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInJlbW92ZVwiIChjbGljayk9XCJkaXNtaXNzRXJyb3IoKVwiPsODwpc8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGlucHV0IHR5cGU9XCJmaWxlXCIgI2ZpbGVJbnB1dCAoY2hhbmdlKT1cIm9uRmlsZUNoYW5nZWQoKVwiPlxyXG4gIDxkaXYgY2xhc3M9XCJkcmFnLW92ZXJsYXlcIiBbaGlkZGVuXT1cInRydWVcIiAjZHJhZ092ZXJsYXk+PC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2A6aG9zdHtkaXNwbGF5OmJsb2NrfS5tYXRjaC1wYXJlbnR7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJX0uYWRkLWltYWdlLWJ0bnt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2ZvbnQtd2VpZ2h0OjcwMDtvcGFjaXR5Oi41O2JvcmRlcjowfS5hZGQtaW1hZ2UtYnRuOmhvdmVye29wYWNpdHk6Ljc7Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZC1jb2xvcjojZGRkO2JveC1zaGFkb3c6aW5zZXQgMCAwIDVweCByZ2JhKDAsMCwwLC4zKX0uYWRkLWltYWdlLWJ0biAucGx1c3tmb250LXNpemU6MzBweDtmb250LXdlaWdodDo0MDA7bWFyZ2luLWJvdHRvbTo1cHg7bWFyZ2luLXRvcDo1cHh9aW1ne2N1cnNvcjpwb2ludGVyO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7bWFyZ2luLXJpZ2h0Oi01MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO21heC13aWR0aDoxMDAlfS5pbWFnZS1jb250YWluZXJ7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kLWNvbG9yOiNmMWYxZjE7Ym94LXNoYWRvdzppbnNldCAwIDAgNXB4IHJnYmEoMCwwLDAsLjIpfS5yZW1vdmV7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7cmlnaHQ6MDt3aWR0aDo0MHB4O2hlaWdodDo0MHB4O2ZvbnQtc2l6ZToyNXB4O3RleHQtYWxpZ246Y2VudGVyO29wYWNpdHk6Ljg7Ym9yZGVyOjA7Y3Vyc29yOnBvaW50ZXJ9LnNlbGVjdGVkLXN0YXR1cy13cmFwcGVyPi5yZW1vdmU6aG92ZXJ7b3BhY2l0eTouNztiYWNrZ3JvdW5kLWNvbG9yOiNmZmZ9LmVycm9yIC5yZW1vdmV7b3BhY2l0eTouNX0uZXJyb3IgLnJlbW92ZTpob3ZlcntvcGFjaXR5Oi43fWlucHV0e2Rpc3BsYXk6bm9uZX0uZXJyb3J7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtib3JkZXI6MXB4IHNvbGlkICNlM2E1YTI7Y29sb3I6I2QyNzA2YjtiYWNrZ3JvdW5kLWNvbG9yOiNmYmYxZjA7cG9zaXRpb246cmVsYXRpdmU7dGV4dC1hbGlnbjpjZW50ZXI7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcn0uZXJyb3ItbWVzc2FnZXt3aWR0aDoxMDAlO2xpbmUtaGVpZ2h0OjE4cHh9LnByb2dyZXNzLWJhcntwb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MTAlO2xlZnQ6MTAlO3dpZHRoOjgwJTtoZWlnaHQ6NXB4O2JhY2tncm91bmQtY29sb3I6Z3JleTtvcGFjaXR5Oi45O292ZXJmbG93OmhpZGRlbn0uYmFye3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO2JhY2tncm91bmQtY29sb3I6I2E0YzYzOX0uZHJhZy1vdmVybGF5e3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JhY2tncm91bmQtY29sb3I6I2ZmMDtvcGFjaXR5Oi4zfS5zay1mYWRpbmctY2lyY2xle3dpZHRoOjQwcHg7aGVpZ2h0OjQwcHg7cG9zaXRpb246cmVsYXRpdmU7dG9wOjUwJTtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MH0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOmJlZm9yZXtjb250ZW50OicnO2Rpc3BsYXk6YmxvY2s7bWFyZ2luOjAgYXV0bzt3aWR0aDoxNSU7aGVpZ2h0OjE1JTtiYWNrZ3JvdW5kLWNvbG9yOiMzMzM7Ym9yZGVyLXJhZGl1czoxMDAlOy13ZWJraXQtYW5pbWF0aW9uOjEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYm90aCBzay1jaXJjbGVGYWRlRGVsYXk7YW5pbWF0aW9uOjEuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYm90aCBzay1jaXJjbGVGYWRlRGVsYXl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTJ7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDMwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlM3std2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoNjBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoNjBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU0ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg5MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSg5MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTV7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDEyMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgxMjBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU2ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgxNTBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMTUwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlN3std2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTgwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDE4MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTh7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDIxMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgyMTBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU5ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgyNDBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMjQwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTB7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDI3MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgyNzBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzAwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMwMGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTEyey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMzBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMzMwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LTEuMXM7YW5pbWF0aW9uLWRlbGF5Oi0xLjFzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUzOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotMXM7YW5pbWF0aW9uLWRlbGF5Oi0xc30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNDpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS45czthbmltYXRpb24tZGVsYXk6LS45c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS44czthbmltYXRpb24tZGVsYXk6LS44c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS43czthbmltYXRpb24tZGVsYXk6LS43c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNzpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS42czthbmltYXRpb24tZGVsYXk6LS42c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlODpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS41czthbmltYXRpb24tZGVsYXk6LS41c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS40czthbmltYXRpb24tZGVsYXk6LS40c30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTA6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uM3M7YW5pbWF0aW9uLWRlbGF5Oi0uM3N9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTExOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotLjJzO2FuaW1hdGlvbi1kZWxheTotLjJzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMjpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS4xczthbmltYXRpb24tZGVsYXk6LS4xc31ALXdlYmtpdC1rZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5ezAlLDEwMCUsMzkle29wYWNpdHk6MH00MCV7b3BhY2l0eToxfX1Aa2V5ZnJhbWVzIHNrLWNpcmNsZUZhZGVEZWxheXswJSwxMDAlLDM5JXtvcGFjaXR5OjB9NDAle29wYWNpdHk6MX19YF0sXHJcbiAgaG9zdDoge1xyXG4gICAgJ1tzdHlsZS53aWR0aF0nOiAndGh1bWJuYWlsV2lkdGggKyBcInB4XCInLFxyXG4gICAgJ1tzdHlsZS5oZWlnaHRdJzogJ3RodW1ibmFpbEhlaWdodCArIFwicHhcIidcclxuICB9LFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gSW1hZ2VVcGxvYWRlckNvbXBvbmVudCksXHJcbiAgICAgIG11bHRpOiB0cnVlXHJcbiAgICB9XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgSW1hZ2VVcGxvYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdDaGVja2VkLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcbiAgc3RhdHVzRW51bSA9IFN0YXR1cztcclxuICBfc3RhdHVzOiBTdGF0dXMgPSBTdGF0dXMuTm90U2VsZWN0ZWQ7XHJcblxyXG4gIHRodW1ibmFpbFdpZHRoID0gMTUwO1xyXG4gIHRodW1ibmFpbEhlaWdodCA9IDE1MDtcclxuICBfaW1hZ2VUaHVtYm5haWw6IGFueTtcclxuICBfZXJyb3JNZXNzYWdlOiBzdHJpbmc7XHJcbiAgcHJvZ3Jlc3M6IG51bWJlcjtcclxuICBvcmlnSW1hZ2VXaWR0aDogbnVtYmVyO1xyXG4gIG9yZ2lJbWFnZUhlaWdodDogbnVtYmVyO1xyXG5cclxuICBjcm9wcGVyOiBDcm9wcGVyID0gdW5kZWZpbmVkO1xyXG4gIGZpbGVUb1VwbG9hZDogRmlsZTtcclxuXHJcbiAgQFZpZXdDaGlsZCgnaW1hZ2VFbGVtZW50JykgaW1hZ2VFbGVtZW50OiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2ZpbGVJbnB1dCcpIGZpbGVJbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnZHJhZ092ZXJsYXknKSBkcmFnT3ZlcmxheUVsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcbiAgQElucHV0KCkgb3B0aW9uczogSW1hZ2VVcGxvYWRlck9wdGlvbnM7XHJcbiAgQE91dHB1dCgpIHVwbG9hZDogRXZlbnRFbWl0dGVyPEZpbGVRdWV1ZU9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPEZpbGVRdWV1ZU9iamVjdD4oKTtcclxuICBAT3V0cHV0KCkgc3RhdHVzQ2hhbmdlOiBFdmVudEVtaXR0ZXI8U3RhdHVzPiA9IG5ldyBFdmVudEVtaXR0ZXI8U3RhdHVzPigpO1xyXG5cclxuICBwcm9wYWdhdGVDaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcixcclxuICAgIHByaXZhdGUgdXBsb2FkZXI6IEltYWdlVXBsb2FkZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHsgfVxyXG5cclxuICBnZXQgaW1hZ2VUaHVtYm5haWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5faW1hZ2VUaHVtYm5haWw7XHJcbiAgfVxyXG5cclxuICBzZXQgaW1hZ2VUaHVtYm5haWwodmFsdWUpIHtcclxuICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gdmFsdWU7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSh0aGlzLl9pbWFnZVRodW1ibmFpbCk7XHJcblxyXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuU2VsZWN0ZWQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Ob3RTZWxlY3RlZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBlcnJvck1lc3NhZ2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZXJyb3JNZXNzYWdlO1xyXG4gIH1cclxuXHJcbiAgc2V0IGVycm9yTWVzc2FnZSh2YWx1ZSkge1xyXG4gICAgdGhpcy5fZXJyb3JNZXNzYWdlID0gdmFsdWU7XHJcblxyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLkVycm9yO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTm90U2VsZWN0ZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgc3RhdHVzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcclxuICB9XHJcblxyXG4gIHNldCBzdGF0dXModmFsdWUpIHtcclxuICAgIHRoaXMuX3N0YXR1cyA9IHZhbHVlO1xyXG4gICAgdGhpcy5zdGF0dXNDaGFuZ2UuZW1pdCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICB0aGlzLmxvYWRBbmRSZXNpemUodmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLk5vdFNlbGVjdGVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UgPSBmbjtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKCkge31cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGh1bWJuYWlsV2lkdGgpIHtcclxuICAgICAgICB0aGlzLnRodW1ibmFpbFdpZHRoID0gdGhpcy5vcHRpb25zLnRodW1ibmFpbFdpZHRoO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy50aHVtYm5haWxIZWlnaHQgPSB0aGlzLm9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVzaXplT25Mb2FkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucmVzaXplT25Mb2FkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9VcGxvYWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5hdXRvVXBsb2FkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNyb3BFbmFibGVkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuY3JvcEVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvVXBsb2FkICYmIHRoaXMub3B0aW9ucy5jcm9wRW5hYmxlZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYXV0b1VwbG9hZCBhbmQgY3JvcEVuYWJsZWQgY2Fubm90IGJlIGVuYWJsZWQgc2ltdWx0YW5lb3VzbHknKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY3JvcEVuYWJsZWQgJiYgdGhpcy5pbWFnZUVsZW1lbnQgJiYgdGhpcy5maWxlVG9VcGxvYWQgJiYgIXRoaXMuY3JvcHBlcikge1xyXG4gICAgICB0aGlzLmNyb3BwZXIgPSBuZXcgQ3JvcHBlcih0aGlzLmltYWdlRWxlbWVudC5uYXRpdmVFbGVtZW50LCB7XHJcbiAgICAgICAgdmlld01vZGU6IDEsXHJcbiAgICAgICAgYXNwZWN0UmF0aW86IHRoaXMub3B0aW9ucy5jcm9wQXNwZWN0UmF0aW8gPyB0aGlzLm9wdGlvbnMuY3JvcEFzcGVjdFJhdGlvIDogbnVsbFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMuY3JvcHBlcikge1xyXG4gICAgICB0aGlzLmNyb3BwZXIuZGVzdHJveSgpO1xyXG4gICAgICB0aGlzLmNyb3BwZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZEFuZFJlc2l6ZSh1cmw6IHN0cmluZykge1xyXG4gICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTG9hZGluZztcclxuXHJcbiAgICB0aGlzLnVwbG9hZGVyLmdldEZpbGUodXJsLCB0aGlzLm9wdGlvbnMpLnN1YnNjcmliZShmaWxlID0+IHtcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXNpemVPbkxvYWQpIHtcclxuICAgICAgICAvLyB0aHVtYm5haWxcclxuICAgICAgICBjb25zdCByZXN1bHQ6IEltYWdlUmVzdWx0ID0ge1xyXG4gICAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICAgIHVybDogVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVzaXplKHJlc3VsdCkudGhlbihyID0+IHtcclxuICAgICAgICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gci5yZXNpemVkLmRhdGFVUkw7XHJcbiAgICAgICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Mb2FkZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJbWFnZVJlc3VsdCA9IHtcclxuICAgICAgICAgIGZpbGU6IG51bGwsXHJcbiAgICAgICAgICB1cmw6IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmZpbGVUb0RhdGFVUkwoZmlsZSwgcmVzdWx0KS50aGVuKHIgPT4ge1xyXG4gICAgICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSByLmRhdGFVUkw7XHJcbiAgICAgICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Mb2FkZWQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sIGVycm9yID0+IHtcclxuICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBlcnJvciB8fCAnRXJyb3Igd2hpbGUgZ2V0dGluZyBhbiBpbWFnZSc7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uSW1hZ2VDbGlja2VkKCkge1xyXG4gICAgdGhpcy5yZW5kZXJlci5pbnZva2VFbGVtZW50TWV0aG9kKHRoaXMuZmlsZUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY2xpY2snKTtcclxuICB9XHJcblxyXG4gIG9uRmlsZUNoYW5nZWQoKSB7XHJcbiAgICBjb25zdCBmaWxlID0gdGhpcy5maWxlSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZmlsZXNbMF07XHJcbiAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmFsaWRhdGVBbmRVcGxvYWQoZmlsZSk7XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZUFuZFVwbG9hZChmaWxlOiBGaWxlKSB7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShudWxsKTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcykge1xyXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcy5zb21lKGFsbG93ZWRUeXBlID0+IGZpbGUudHlwZSA9PT0gYWxsb3dlZFR5cGUpKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSAnT25seSB0aGVzZSBpbWFnZSB0eXBlcyBhcmUgYWxsb3dlZDogJyArIHRoaXMub3B0aW9ucy5hbGxvd2VkSW1hZ2VUeXBlcy5qb2luKCcsICcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm1heEltYWdlU2l6ZSkge1xyXG4gICAgICBpZiAoZmlsZS5zaXplID4gdGhpcy5vcHRpb25zLm1heEltYWdlU2l6ZSAqIDEwMjQgKiAxMDI0KSB7XHJcbiAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBgSW1hZ2UgbXVzdCBub3QgYmUgbGFyZ2VyIHRoYW4gJHt0aGlzLm9wdGlvbnMubWF4SW1hZ2VTaXplfSBNQmA7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5maWxlVG9VcGxvYWQgPSBmaWxlO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmF1dG9VcGxvYWQpIHtcclxuICAgICAgdGhpcy51cGxvYWRJbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRodW1ibmFpbFxyXG4gICAgY29uc3QgcmVzdWx0OiBJbWFnZVJlc3VsdCA9IHtcclxuICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgdXJsOiBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucmVzaXplKHJlc3VsdCkudGhlbihyID0+IHtcclxuICAgICAgdGhpcy5faW1hZ2VUaHVtYm5haWwgPSByLnJlc2l6ZWQuZGF0YVVSTDtcclxuICAgICAgdGhpcy5vcmlnSW1hZ2VXaWR0aCA9IHIud2lkdGg7XHJcbiAgICAgIHRoaXMub3JnaUltYWdlSGVpZ2h0ID0gci5oZWlnaHQ7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zICYmICF0aGlzLm9wdGlvbnMuYXV0b1VwbG9hZCkge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLlNlbGVjdGVkO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwbG9hZEltYWdlKCkge1xyXG4gICAgdGhpcy5wcm9ncmVzcyA9IDA7XHJcbiAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5VcGxvYWRpbmc7XHJcblxyXG4gICAgbGV0IGNyb3BPcHRpb25zOiBDcm9wT3B0aW9ucztcclxuXHJcbiAgICBpZiAodGhpcy5jcm9wcGVyKSB7XHJcbiAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy5vcmlnSW1hZ2VXaWR0aCAvIHRoaXMuY3JvcHBlci5nZXRJbWFnZURhdGEoKS5uYXR1cmFsV2lkdGg7XHJcbiAgICAgIGNvbnN0IGNyb3BEYXRhID0gdGhpcy5jcm9wcGVyLmdldERhdGEoKTtcclxuXHJcbiAgICAgIGNyb3BPcHRpb25zID0ge1xyXG4gICAgICAgIHg6IE1hdGgucm91bmQoY3JvcERhdGEueCAqIHNjYWxlKSxcclxuICAgICAgICB5OiBNYXRoLnJvdW5kKGNyb3BEYXRhLnkgKiBzY2FsZSksXHJcbiAgICAgICAgd2lkdGg6IE1hdGgucm91bmQoY3JvcERhdGEud2lkdGggKiBzY2FsZSksXHJcbiAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGNyb3BEYXRhLmhlaWdodCAqIHNjYWxlKVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgLy8gY29uc3QgcXVldWVPYmogPSB0aGlzLnVwbG9hZGVyLnVwbG9hZEZpbGUodGhpcy5maWxlVG9VcGxvYWQsIHRoaXMub3B0aW9ucywgY3JvcE9wdGlvbnMpO1xyXG5cclxuICAgIC8vIGZpbGUgcHJvZ3Jlc3NcclxuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkRmlsZSh0aGlzLmZpbGVUb1VwbG9hZCwgdGhpcy5vcHRpb25zLCBjcm9wT3B0aW9ucykuc3Vic2NyaWJlKGZpbGUgPT4ge1xyXG4gICAgICB0aGlzLnByb2dyZXNzID0gZmlsZS5wcm9ncmVzcztcclxuXHJcbiAgICAgIGlmIChmaWxlLmlzRXJyb3IoKSkge1xyXG4gICAgICAgIGlmIChmaWxlLnJlc3BvbnNlLnN0YXR1cyB8fCBmaWxlLnJlc3BvbnNlLnN0YXR1c1RleHQpIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gYCR7ZmlsZS5yZXNwb25zZS5zdGF0dXN9OiAke2ZpbGUucmVzcG9uc2Uuc3RhdHVzVGV4dH1gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9ICdFcnJvciB3aGlsZSB1cGxvYWRpbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBvbiBzb21lIHVwbG9hZCBlcnJvcnMgY2hhbmdlIGRldGVjdGlvbiBkb2VzIG5vdCB3b3JrLCBzbyB3ZSBhcmUgZm9yY2luZyBtYW51YWxseVxyXG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWZpbGUuaW5Qcm9ncmVzcygpKSB7XHJcbiAgICAgICAgLy8gbm90aWZ5IHRoYXQgdmFsdWUgd2FzIGNoYW5nZWQgb25seSB3aGVuIGltYWdlIHdhcyB1cGxvYWRlZCBhbmQgbm8gZXJyb3JcclxuICAgICAgICBpZiAoZmlsZS5pc1N1Y2Nlc3MoKSkge1xyXG4gICAgICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UodGhpcy5faW1hZ2VUaHVtYm5haWwpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuU2VsZWN0ZWQ7XHJcbiAgICAgICAgICB0aGlzLmZpbGVUb1VwbG9hZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBsb2FkLmVtaXQoZmlsZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlSW1hZ2UoKSB7XHJcbiAgICB0aGlzLmZpbGVJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZSA9IG51bGw7XHJcbiAgICB0aGlzLmltYWdlVGh1bWJuYWlsID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGlmICh0aGlzLmNyb3BwZXIpIHtcclxuICAgICAgdGhpcy5jcm9wcGVyLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5jcm9wcGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpc21pc3NFcnJvcigpIHtcclxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5yZW1vdmVJbWFnZSgpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pIGRyb3AoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgIGlmICghZS5kYXRhVHJhbnNmZXIgfHwgIWUuZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52YWxpZGF0ZUFuZFVwbG9hZChlLmRhdGFUcmFuc2Zlci5maWxlc1swXSk7XHJcbiAgICB0aGlzLnVwZGF0ZURyYWdPdmVybGF5U3R5bGVzKGZhbHNlKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pIGRyYWdlbnRlcihlOiBEcmFnRXZlbnQpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnb3ZlcicsIFsnJGV2ZW50J10pIGRyYWdvdmVyKGU6IERyYWdFdmVudCkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIHRoaXMudXBkYXRlRHJhZ092ZXJsYXlTdHlsZXModHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKSBkcmFnbGVhdmUoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgdGhpcy51cGRhdGVEcmFnT3ZlcmxheVN0eWxlcyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZURyYWdPdmVybGF5U3R5bGVzKGlzRHJhZ092ZXI6IGJvb2xlYW4pIHtcclxuICAgIC8vIFRPRE86IGZpbmQgYSB3YXkgdGhhdCBkb2VzIG5vdCB0cmlnZ2VyIGRyYWdsZWF2ZSB3aGVuIGRpc3BsYXlpbmcgb3ZlcmxheVxyXG4gICAgLy8gaWYgKGlzRHJhZ092ZXIpIHtcclxuICAgIC8vICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLmRyYWdPdmVybGF5RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgLy8gfSBlbHNlIHtcclxuICAgIC8vICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLmRyYWdPdmVybGF5RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlc2l6ZShyZXN1bHQ6IEltYWdlUmVzdWx0KTogUHJvbWlzZTxJbWFnZVJlc3VsdD4ge1xyXG4gICAgY29uc3QgcmVzaXplT3B0aW9uczogUmVzaXplT3B0aW9ucyA9IHtcclxuICAgICAgcmVzaXplSGVpZ2h0OiB0aGlzLnRodW1ibmFpbEhlaWdodCxcclxuICAgICAgcmVzaXplV2lkdGg6IHRoaXMudGh1bWJuYWlsV2lkdGgsXHJcbiAgICAgIHJlc2l6ZVR5cGU6IHJlc3VsdC5maWxlLnR5cGUsXHJcbiAgICAgIHJlc2l6ZU1vZGU6IHRoaXMub3B0aW9ucy50aHVtYm5haWxSZXNpemVNb2RlXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBjcmVhdGVJbWFnZShyZXN1bHQudXJsLCBpbWFnZSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGF0YVVybCA9IHJlc2l6ZUltYWdlKGltYWdlLCByZXNpemVPcHRpb25zKTtcclxuXHJcbiAgICAgICAgcmVzdWx0LndpZHRoID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgcmVzdWx0LmhlaWdodCA9IGltYWdlLmhlaWdodDtcclxuICAgICAgICByZXN1bHQucmVzaXplZCA9IHtcclxuICAgICAgICAgIGRhdGFVUkw6IGRhdGFVcmwsXHJcbiAgICAgICAgICB0eXBlOiB0aGlzLmdldFR5cGUoZGF0YVVybClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFR5cGUoZGF0YVVybDogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZGF0YVVybC5tYXRjaCgvOiguK1xcLy4rOykvKVsxXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZmlsZVRvRGF0YVVSTChmaWxlOiBGaWxlLCByZXN1bHQ6IEltYWdlUmVzdWx0KTogUHJvbWlzZTxJbWFnZVJlc3VsdD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHJlc3VsdC5kYXRhVVJMID0gcmVhZGVyLnJlc3VsdDtcclxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9pbWFnZS11cGxvYWRlci5jb21wb25lbnQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtJbWFnZVVwbG9hZGVyQ29tcG9uZW50XSxcclxuICBleHBvcnRzOiBbSW1hZ2VVcGxvYWRlckNvbXBvbmVudF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkZXJNb2R1bGUgeyB9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxJQUVBO0lBT0UseUJBQVksSUFBUztRQUFyQixpQkFFQztzQkFQZ0MsZUFBZSxDQUFDLE9BQU87d0JBQzlCLENBQUM7dUJBQ0ksSUFBSTt3QkFDc0IsSUFBSTt5QkFZMUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLE9BQU8sR0FBQTt5QkFDN0MsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLE9BQU8sR0FBQTt1QkFDL0MsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLEtBQUssR0FBQTswQkFDeEMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLFFBQVEsR0FBQTs0QkFDNUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLE9BQU8sSUFBSSxLQUFJLENBQUMsTUFBTSxLQUFLLGVBQWUsQ0FBQyxLQUFLLEdBQUE7UUFiMUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbEI7MEJBZEg7SUEyQkM7Ozs7OztBQzNCRDtJQWFFLDhCQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0tBQUk7Ozs7Ozs7SUFFeEMseUNBQVU7Ozs7OztJQUFWLFVBQVcsSUFBVSxFQUFFLE9BQTRCLEVBQUUsV0FBeUI7UUFBOUUsaUJBaURDO1FBaERDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUIscUJBQU0sSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFaEQsSUFBSSxXQUFXLEVBQUU7WUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDdEQ7O1FBR0QscUJBQU0sR0FBRyxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRTtZQUMzRCxjQUFjLEVBQUUsSUFBSTtZQUNwQixlQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWU7WUFDeEMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1NBQ3JDLENBQUMsQ0FBQztRQUVILE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLEdBQUc7WUFDMUIscUJBQU0sUUFBUSxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUNqRCxVQUFDLEtBQVU7Z0JBQ1QsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxjQUFjLEVBQUU7b0JBQy9DLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN0QyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNwQjtxQkFBTSxJQUFJLEtBQUssWUFBWSxZQUFZLEVBQUU7b0JBQ3hDLEtBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN0QyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNuQixHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQ2hCO2FBQ0YsRUFDRCxVQUFDLEdBQXNCO2dCQUNyQixJQUFJLEdBQUcsQ0FBQyxLQUFLLFlBQVksS0FBSyxFQUFFOzs7b0JBRTlCLEtBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNuQixHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQ2hCO3FCQUFNOzs7b0JBRUwsS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2xDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ25CLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDaEI7YUFDRixDQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7S0FDSjs7Ozs7O0lBRUQsc0NBQU87Ozs7O0lBQVAsVUFBUSxHQUFXLEVBQUUsT0FBeUQ7UUFBOUUsaUJBaUJDO1FBaEJDLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFFBQXdCO1lBQ2hELHFCQUFJLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBRWhDLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtnQkFDckIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFLLE9BQU8sQ0FBQyxlQUFlLFNBQUksT0FBTyxDQUFDLFNBQVcsQ0FBQyxDQUFDO2FBQzlGO1lBRUQsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO2dCQUN6RSxxQkFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQzdELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNyQixFQUFFLFVBQUEsR0FBRztnQkFDSixRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0IsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ3JCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztLQUNKOzs7OztJQUVPLDRDQUFhOzs7O2NBQUMsT0FBNEI7UUFDaEQscUJBQUksT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFFaEMsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ3JCLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBSyxPQUFPLENBQUMsZUFBZSxTQUFJLE9BQU8sQ0FBQyxTQUFXLENBQUMsQ0FBQztTQUM5RjtRQUVELElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTtZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO2dCQUM3QyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzNELENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxPQUFPLENBQUM7Ozs7Ozs7SUFHVCw4Q0FBZTs7Ozs7Y0FBQyxRQUF5QixFQUFFLEtBQVU7O1FBRTNELHFCQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5RCxRQUFRLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUM3QixRQUFRLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUM7Ozs7Ozs7O0lBSXJDLDhDQUFlOzs7OztjQUFDLFFBQXlCLEVBQUUsUUFBMkI7O1FBRTVFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQztRQUMxQyxRQUFRLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7Ozs7Ozs7O0lBS3ZCLDRDQUFhOzs7OztjQUFDLFFBQXlCLEVBQUUsUUFBMkI7O1FBRTFFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQztRQUN4QyxRQUFRLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7Ozs7OztJQUl2QiwwQ0FBVzs7OztjQUFDLE9BQTRCO1FBQzlDLE9BQU8sQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGVBQWUsSUFBSSxLQUFLLENBQUM7UUFDM0QsT0FBTyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQztRQUNsRCxPQUFPLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLElBQUksUUFBUSxDQUFDO1FBQzlELE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUM7OztnQkExSG5ELFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7Z0JBUlEsVUFBVTs7OytCQUZuQjs7Ozs7Ozs7Ozs7O0FDRUEscUJBQTRCLEdBQVcsRUFBRSxFQUFpQztJQUN4RSxxQkFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUMxQixLQUFLLENBQUMsTUFBTSxHQUFHO1FBQ2IsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ1gsQ0FBQztJQUNGLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0NBQ2pCO0FBRUQscUJBQU0sWUFBWSxHQUFHLHlCQUF5QixDQUFDOzs7O0FBRS9DO0lBQ0UscUJBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkQsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsWUFBWSxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUNsQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN2QztJQUVELHlCQUEwQixVQUFVLEVBQUM7Q0FDdEM7Ozs7OztBQUVELHFCQUE0QixTQUEyQixFQUFFLEVBTXBDO1FBTm9DLDRCQU1wQyxFQUxuQiw4QkFBWSxFQUNaLDRCQUFXLEVBQ1gscUJBQW1CLEVBQW5CLHdDQUFtQixFQUNuQixrQkFBeUIsRUFBekIsOENBQXlCLEVBQ3pCLGtCQUFtQixFQUFuQix3Q0FBbUI7SUFHbkIscUJBQU0sTUFBTSxHQUFHLGFBQWEsRUFBRSxDQUFDO0lBRS9CLHFCQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQzlCLHFCQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO0lBQzVCLHFCQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDaEIscUJBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUVoQixJQUFJLFVBQVUsS0FBSyxNQUFNLEVBQUU7O1FBRXpCLElBQUksS0FBSyxHQUFHLE1BQU0sR0FBRyxXQUFXLEdBQUcsWUFBWSxFQUFFO1lBQy9DLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUM7U0FDekQ7YUFBTTtZQUNMLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxZQUFZLEdBQUcsV0FBVyxDQUFDLENBQUM7U0FDekQ7UUFFRCxNQUFNLENBQUMsS0FBSyxHQUFHLFdBQVcsSUFBSSxLQUFLLEdBQUcsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUMxRCxNQUFNLENBQUMsTUFBTSxHQUFHLFlBQVksSUFBSSxNQUFNLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQztRQUUvRCxPQUFPLEdBQUcsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUMxQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQzs7UUFHNUMscUJBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDOUY7U0FBTSxJQUFJLFVBQVUsS0FBSyxLQUFLLEVBQUU7O1FBRTdCLElBQUksS0FBSyxHQUFHLE1BQU0sRUFBRTtZQUNoQixJQUFJLEtBQUssR0FBRyxXQUFXLEVBQUU7Z0JBQ3JCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQ25ELEtBQUssR0FBRyxXQUFXLENBQUM7YUFDdkI7U0FDSjthQUFNO1lBQ0gsSUFBSSxNQUFNLEdBQUcsWUFBWSxFQUFFO2dCQUN2QixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLEdBQUcsWUFBWSxDQUFDO2FBQ3pCO1NBQ0o7UUFFRCxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7UUFHdkIscUJBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDakQ7U0FBTTtRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLEdBQUcsVUFBVSxDQUFDLENBQUM7S0FDdEQ7O0lBR0QsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztDQUNwRDs7Ozs7O0FDbEZEOzs7Ozs7Ozs7Ozs7Ozs7O0lBNEhFLGdDQUNVLFVBQ0EsVUFDQTtRQUZBLGFBQVEsR0FBUixRQUFRO1FBQ1IsYUFBUSxHQUFSLFFBQVE7UUFDUixtQkFBYyxHQUFkLGNBQWM7MEJBMUJYLE1BQU07dUJBQ0QsTUFBTSxDQUFDLFdBQVc7OEJBRW5CLEdBQUc7K0JBQ0YsR0FBRzt1QkFPRixTQUFTO3NCQU9zQixJQUFJLFlBQVksRUFBbUI7NEJBQ3RDLElBQUksWUFBWSxFQUFVOytCQUV2RCxVQUFDLENBQU0sS0FBTztLQUtnQjtJQUVoRCxzQkFBSSxrREFBYzs7OztRQUFsQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3Qjs7Ozs7UUFFRCxVQUFtQixLQUFLO1lBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1lBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRTNDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO2FBQy9CO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzthQUNsQztTQUNGOzs7T0FYQTtJQWFELHNCQUFJLGdEQUFZOzs7O1FBQWhCO1lBQ0UsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO1NBQzNCOzs7OztRQUVELFVBQWlCLEtBQUs7WUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFFM0IsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQzVCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzthQUNsQztTQUNGOzs7T0FWQTtJQVlELHNCQUFJLDBDQUFNOzs7O1FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7Ozs7O1FBRUQsVUFBVyxLQUFLO1lBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0I7OztPQUxBOzs7OztJQU9ELDJDQUFVOzs7O0lBQVYsVUFBVyxLQUFVO1FBQ25CLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7WUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1NBQ2xDO0tBQ0Y7Ozs7O0lBRUQsaURBQWdCOzs7O0lBQWhCLFVBQWlCLEVBQW9CO1FBQ25DLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0tBQzNCOzs7O0lBRUQsa0RBQWlCOzs7SUFBakIsZUFBc0I7Ozs7SUFFdEIseUNBQVE7OztJQUFSO1FBQ0UsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7YUFDbkQ7WUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFO2dCQUNoQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO2FBQ3JEO1lBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksS0FBSyxTQUFTLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzthQUNsQztZQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7YUFDaEM7WUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2FBQ2xDO1lBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtnQkFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO2FBQ2hGO1NBQ0Y7S0FDRjs7OztJQUVELG1EQUFrQjs7O0lBQWxCO1FBQ0UsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDdkcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRTtnQkFDMUQsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxHQUFHLElBQUk7YUFDaEYsQ0FBQyxDQUFDO1NBQ0o7S0FDRjs7OztJQUVELDRDQUFXOzs7SUFBWDtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO0tBQ0Y7Ozs7O0lBRUQsOENBQWE7Ozs7SUFBYixVQUFjLEdBQVc7UUFBekIsaUJBNkJDO1FBNUJDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUU3QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUk7WUFDckQsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTs7Z0JBRTdCLHFCQUFNLE1BQU0sR0FBZ0I7b0JBQzFCLElBQUksRUFBRSxJQUFJO29CQUNWLEdBQUcsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztpQkFDL0IsQ0FBQztnQkFFRixLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7b0JBQ3hCLEtBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7b0JBQ3pDLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztpQkFDN0IsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wscUJBQU0sTUFBTSxHQUFnQjtvQkFDMUIsSUFBSSxFQUFFLElBQUk7b0JBQ1YsR0FBRyxFQUFFLElBQUk7aUJBQ1YsQ0FBQztnQkFFRixLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO29CQUNyQyxLQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ2pDLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztpQkFDN0IsQ0FBQyxDQUFDO2FBQ0o7U0FDRixFQUFFLFVBQUEsS0FBSztZQUNOLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxJQUFJLDhCQUE4QixDQUFDO1NBQzdELENBQUMsQ0FBQztLQUNKOzs7O0lBRUQsK0NBQWM7OztJQUFkO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2pGOzs7O0lBRUQsOENBQWE7OztJQUFiO1FBQ0UscUJBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDOUI7Ozs7O0lBRUQsa0RBQWlCOzs7O0lBQWpCLFVBQWtCLElBQVU7UUFBNUIsaUJBc0NDO1FBckNDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0IsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUU7WUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQUEsV0FBVyxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLEdBQUEsQ0FBQyxFQUFFO2dCQUNsRixJQUFJLENBQUMsWUFBWSxHQUFHLHNDQUFzQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2RyxPQUFPO2FBQ1I7U0FDRjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUM3QyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLElBQUksRUFBRTtnQkFDdkQsSUFBSSxDQUFDLFlBQVksR0FBRyxtQ0FBaUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLFFBQUssQ0FBQztnQkFDcEYsT0FBTzthQUNSO1NBQ0Y7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUV6QixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDM0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCOztRQUdELHFCQUFNLE1BQU0sR0FBZ0I7WUFDMUIsSUFBSSxFQUFFLElBQUk7WUFDVixHQUFHLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7U0FDL0IsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztZQUN4QixLQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3pDLEtBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUM5QixLQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFFaEMsSUFBSSxLQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQzVDLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQzthQUMvQjtTQUNGLENBQUMsQ0FBQztLQUNKOzs7O0lBRUQsNENBQVc7OztJQUFYO1FBQUEsaUJBNkNDO1FBNUNDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUUvQixxQkFBSSxXQUF3QixDQUFDO1FBRTdCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixxQkFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQztZQUM3RSxxQkFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUV4QyxXQUFXLEdBQUc7Z0JBQ1osQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDekMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDNUMsQ0FBQztTQUNIOzs7UUFLRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsSUFBSTtZQUNuRixLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFFOUIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2xCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7b0JBQ3BELEtBQUksQ0FBQyxZQUFZLEdBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLFVBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFZLENBQUM7aUJBQzVFO3FCQUFNO29CQUNMLEtBQUksQ0FBQyxZQUFZLEdBQUcsdUJBQXVCLENBQUM7aUJBQzdDOzs7Z0JBRUQsS0FBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUNyQztZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7O2dCQUV0QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtvQkFDcEIsS0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7b0JBQzNDLEtBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFDOUIsS0FBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7aUJBQy9CO2dCQUVELEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hCO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7SUFFRCw0Q0FBVzs7O0lBQVg7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakQsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7UUFFaEMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckI7S0FDRjs7OztJQUVELDZDQUFZOzs7SUFBWjtRQUNFLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQzlCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNwQjs7Ozs7SUFFaUMscUNBQUk7Ozs7Y0FBQyxDQUFZO1FBQ2pELENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbkQsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDOzs7Ozs7SUFHQywwQ0FBUzs7OztjQUFDLENBQVk7UUFDM0QsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7Ozs7O0lBR2dCLHlDQUFROzs7O2NBQUMsQ0FBWTtRQUN6RCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7O0lBR0UsMENBQVM7Ozs7Y0FBQyxDQUFZO1FBQzNELENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDOzs7Ozs7SUFHOUIsd0RBQXVCOzs7O2NBQUMsVUFBbUI7Ozs7Ozs7Ozs7OztJQVMzQyx1Q0FBTTs7OztjQUFDLE1BQW1COztRQUNoQyxxQkFBTSxhQUFhLEdBQWtCO1lBQ25DLFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZTtZQUNsQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDaEMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUM1QixVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUI7U0FDN0MsQ0FBQztRQUVGLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPO1lBQ3pCLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFVBQUEsS0FBSztnQkFDM0IscUJBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBRWxELE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDM0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUM3QixNQUFNLENBQUMsT0FBTyxHQUFHO29CQUNmLE9BQU8sRUFBRSxPQUFPO29CQUNoQixJQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7aUJBQzVCLENBQUM7Z0JBRUYsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2pCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQzs7Ozs7O0lBR0csd0NBQU87Ozs7Y0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7OztJQUdoQyw4Q0FBYTs7Ozs7Y0FBQyxJQUFVLEVBQUUsTUFBbUI7UUFDbkQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU87WUFDekIscUJBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDL0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2pCLENBQUM7WUFDRixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCLENBQUMsQ0FBQzs7O2dCQXJhTixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsUUFBUSxFQUFFLGc1RUErRFg7b0JBQ0MsTUFBTSxFQUFFLENBQUMscTNIQUFxM0gsQ0FBQztvQkFDLzNILElBQUksRUFBRTt3QkFDSixlQUFlLEVBQUUsdUJBQXVCO3dCQUN4QyxnQkFBZ0IsRUFBRSx3QkFBd0I7cUJBQzNDO29CQUNELFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxzQkFBc0IsR0FBQSxDQUFDOzRCQUNyRCxLQUFLLEVBQUUsSUFBSTt5QkFDWjtxQkFDRjtpQkFDRjs7OztnQkFqR0MsUUFBUTtnQkFLRCxvQkFBb0I7Z0JBTFksaUJBQWlCOzs7aUNBaUh2RCxTQUFTLFNBQUMsY0FBYztxQ0FDeEIsU0FBUyxTQUFDLFdBQVc7dUNBQ3JCLFNBQVMsU0FBQyxhQUFhOzRCQUN2QixLQUFLOzJCQUNMLE1BQU07aUNBQ04sTUFBTTt5QkF3UE4sWUFBWSxTQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzs4QkFZL0IsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzs2QkFLcEMsWUFBWSxTQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQzs4QkFNbkMsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7aUNBdll2Qzs7Ozs7OztBQ0FBOzs7O2dCQU1DLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixnQkFBZ0I7cUJBQ2pCO29CQUNELFlBQVksRUFBRSxDQUFDLHNCQUFzQixDQUFDO29CQUN0QyxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDbEM7OzhCQWJEOzs7Ozs7Ozs7Ozs7Ozs7In0=