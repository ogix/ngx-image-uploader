(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('@angular/core'), require('@angular/common/http'), require('@angular/forms'), require('cropperjs'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-image-uploader', ['exports', 'rxjs', '@angular/core', '@angular/common/http', '@angular/forms', 'cropperjs', '@angular/common'], factory) :
    (factory((global['ngx-image-uploader'] = {}),global.rxjs,global.ng.core,global.ng.common.http,global.ng.forms,null,global.ng.common));
}(this, (function (exports,rxjs,i0,i1,forms,Cropper,common) { 'use strict';

    Cropper = Cropper && Cropper.hasOwnProperty('default') ? Cropper['default'] : Cropper;

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
    var FileQueueObject = (function () {
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
    var ImageUploaderService = (function () {
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
                var /** @type {?} */ req = new i1.HttpRequest('POST', options.uploadUrl, form, {
                    reportProgress: true,
                    withCredentials: options.withCredentials,
                    headers: this._buildHeaders(options)
                });
                return rxjs.Observable.create(function (obs) {
                    var /** @type {?} */ queueObj = new FileQueueObject(file);
                    queueObj.request = _this.http.request(req).subscribe(function (event) {
                        if (event.type === i1.HttpEventType.UploadProgress) {
                            _this._uploadProgress(queueObj, event);
                            obs.next(queueObj);
                        }
                        else if (event instanceof i1.HttpResponse) {
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
                return rxjs.Observable.create(function (observer) {
                    var /** @type {?} */ headers = new i1.HttpHeaders();
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
                var /** @type {?} */ headers = new i1.HttpHeaders();
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        ImageUploaderService.ctorParameters = function () {
            return [
                { type: i1.HttpClient, },
            ];
        };
        /** @nocollapse */ ImageUploaderService.ngInjectableDef = i0.defineInjectable({ factory: function ImageUploaderService_Factory() { return new ImageUploaderService(i0.inject(i1.HttpClient)); }, token: ImageUploaderService, providedIn: "root" });
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
    var ImageUploaderComponent = (function () {
        function ImageUploaderComponent(renderer, uploader, changeDetector) {
            this.renderer = renderer;
            this.uploader = uploader;
            this.changeDetector = changeDetector;
            this.statusEnum = Status;
            this._status = Status.NotSelected;
            this.thumbnailWidth = 150;
            this.thumbnailHeight = 150;
            this.cropper = undefined;
            this.upload = new i0.EventEmitter();
            this.statusChange = new i0.EventEmitter();
            this.propagateChange = function (_) { };
        }
        Object.defineProperty(ImageUploaderComponent.prototype, "imageThumbnail", {
            get: /**
             * @return {?}
             */ function () {
                return this._imageThumbnail;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
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
             */ function () {
                return this._errorMessage;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
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
             */ function () {
                return this._status;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
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
            { type: i0.Component, args: [{
                        selector: 'ngx-image-uploader',
                        template: "<div class=\"image-container\">\n  <div class=\"match-parent\" [ngSwitch]=\"status\">\n\n    <div class=\"match-parent\" *ngSwitchCase=\"statusEnum.NotSelected\">\n      <button type=\"button\" class=\"add-image-btn\" (click)=\"onImageClicked()\">\n          <div>\n            <p class=\"plus\">+</p>\n            <p>Click here to add image</p>\n            <p>Or drop image here</p>\n          </div>\n      </button>\n    </div>\n\n    <div class=\"selected-status-wrapper match-parent\" *ngSwitchCase=\"statusEnum.Loaded\">\n      <img [src]=\"imageThumbnail\" #imageElement>\n\n      <button type=\"button\" class=\"remove\" (click)=\"removeImage()\">\u00D7</button>\n    </div>\n\n    <div class=\"selected-status-wrapper match-parent\" *ngSwitchCase=\"statusEnum.Selected\">\n      <img [src]=\"imageThumbnail\" #imageElement>\n\n      <button type=\"button\" class=\"remove\" (click)=\"removeImage()\">\u00D7</button>\n    </div>\n\n    <div *ngSwitchCase=\"statusEnum.Uploading\">\n      <img [attr.src]=\"imageThumbnail ? imageThumbnail : null\" (click)=\"onImageClicked()\">\n\n      <div class=\"progress-bar\">\n        <div class=\"bar\" [style.width]=\"progress+'%'\"></div>\n      </div>\n    </div>\n\n    <div class=\"match-parent\" *ngSwitchCase=\"statusEnum.Loading\">\n      <div class=\"sk-fading-circle\">\n        <div class=\"sk-circle1 sk-circle\"></div>\n        <div class=\"sk-circle2 sk-circle\"></div>\n        <div class=\"sk-circle3 sk-circle\"></div>\n        <div class=\"sk-circle4 sk-circle\"></div>\n        <div class=\"sk-circle5 sk-circle\"></div>\n        <div class=\"sk-circle6 sk-circle\"></div>\n        <div class=\"sk-circle7 sk-circle\"></div>\n        <div class=\"sk-circle8 sk-circle\"></div>\n        <div class=\"sk-circle9 sk-circle\"></div>\n        <div class=\"sk-circle10 sk-circle\"></div>\n        <div class=\"sk-circle11 sk-circle\"></div>\n        <div class=\"sk-circle12 sk-circle\"></div>\n      </div>\n    </div>\n\n    <div class=\"match-parent\" *ngSwitchCase=\"statusEnum.Error\">\n      <div class=\"error\">\n        <div class=\"error-message\">\n          <p>{{errorMessage}}</p>\n        </div>\n        <button type=\"button\" class=\"remove\" (click)=\"dismissError()\">\u00D7</button>\n      </div>\n    </div>\n  </div>\n\n  <input type=\"file\" #fileInput (change)=\"onFileChanged()\">\n  <div class=\"drag-overlay\" [hidden]=\"true\" #dragOverlay></div>\n</div>\n",
                        styles: [":host{display:block}.match-parent{width:100%;height:100%}.add-image-btn{width:100%;height:100%;font-weight:700;opacity:.5;border:0}.add-image-btn:hover{opacity:.7;cursor:pointer;background-color:#ddd;box-shadow:inset 0 0 5px rgba(0,0,0,.3)}.add-image-btn .plus{font-size:30px;font-weight:400;margin-bottom:5px;margin-top:5px}img{cursor:pointer;position:absolute;top:50%;left:50%;margin-right:-50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);max-width:100%}.image-container{width:100%;height:100%;position:relative;display:inline-block;background-color:#f1f1f1;box-shadow:inset 0 0 5px rgba(0,0,0,.2)}.remove{position:absolute;top:0;right:0;width:40px;height:40px;font-size:25px;text-align:center;opacity:.8;border:0;cursor:pointer}.selected-status-wrapper>.remove:hover{opacity:.7;background-color:#fff}.error .remove{opacity:.5}.error .remove:hover{opacity:.7}input{display:none}.error{width:100%;height:100%;border:1px solid #e3a5a2;color:#d2706b;background-color:#fbf1f0;position:relative;text-align:center;display:flex;align-items:center}.error-message{width:100%;line-height:18px}.progress-bar{position:absolute;bottom:10%;left:10%;width:80%;height:5px;background-color:grey;opacity:.9;overflow:hidden}.bar{position:absolute;height:100%;background-color:#a4c639}.drag-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background-color:#ff0;opacity:.3}.sk-fading-circle{width:40px;height:40px;position:relative;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:'';display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;-webkit-animation:1.2s ease-in-out infinite both sk-circleFadeDelay;animation:1.2s ease-in-out infinite both sk-circleFadeDelay}.sk-fading-circle .sk-circle2{-webkit-transform:rotate(30deg);transform:rotate(30deg)}.sk-fading-circle .sk-circle3{-webkit-transform:rotate(60deg);transform:rotate(60deg)}.sk-fading-circle .sk-circle4{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.sk-fading-circle .sk-circle5{-webkit-transform:rotate(120deg);transform:rotate(120deg)}.sk-fading-circle .sk-circle6{-webkit-transform:rotate(150deg);transform:rotate(150deg)}.sk-fading-circle .sk-circle7{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.sk-fading-circle .sk-circle8{-webkit-transform:rotate(210deg);transform:rotate(210deg)}.sk-fading-circle .sk-circle9{-webkit-transform:rotate(240deg);transform:rotate(240deg)}.sk-fading-circle .sk-circle10{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.sk-fading-circle .sk-circle11{-webkit-transform:rotate(300deg);transform:rotate(300deg)}.sk-fading-circle .sk-circle12{-webkit-transform:rotate(330deg);transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.sk-fading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}@keyframes sk-circleFadeDelay{0%,100%,39%{opacity:0}40%{opacity:1}}"],
                        host: {
                            '[style.width]': 'thumbnailWidth + "px"',
                            '[style.height]': 'thumbnailHeight + "px"'
                        },
                        providers: [
                            {
                                provide: forms.NG_VALUE_ACCESSOR,
                                useExisting: i0.forwardRef(function () { return ImageUploaderComponent; }),
                                multi: true
                            }
                        ]
                    },] },
        ];
        /** @nocollapse */
        ImageUploaderComponent.ctorParameters = function () {
            return [
                { type: i0.Renderer, },
                { type: ImageUploaderService, },
                { type: i0.ChangeDetectorRef, },
            ];
        };
        ImageUploaderComponent.propDecorators = {
            "imageElement": [{ type: i0.ViewChild, args: ['imageElement',] },],
            "fileInputElement": [{ type: i0.ViewChild, args: ['fileInput',] },],
            "dragOverlayElement": [{ type: i0.ViewChild, args: ['dragOverlay',] },],
            "options": [{ type: i0.Input },],
            "upload": [{ type: i0.Output },],
            "statusChange": [{ type: i0.Output },],
            "drop": [{ type: i0.HostListener, args: ['drop', ['$event'],] },],
            "dragenter": [{ type: i0.HostListener, args: ['dragenter', ['$event'],] },],
            "dragover": [{ type: i0.HostListener, args: ['dragover', ['$event'],] },],
            "dragleave": [{ type: i0.HostListener, args: ['dragleave', ['$event'],] },],
        };
        return ImageUploaderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ImageUploaderModule = (function () {
        function ImageUploaderModule() {
        }
        ImageUploaderModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            i1.HttpClientModule
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

    exports.ImageUploaderService = ImageUploaderService;
    exports.Status = Status;
    exports.ImageUploaderComponent = ImageUploaderComponent;
    exports.ImageUploaderModule = ImageUploaderModule;
    exports.FileQueueObject = FileQueueObject;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltYWdlLXVwbG9hZGVyLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmd4LWltYWdlLXVwbG9hZGVyL2xpYi9maWxlLXF1ZXVlLW9iamVjdC50cyIsIm5nOi8vbmd4LWltYWdlLXVwbG9hZGVyL2xpYi9pbWFnZS11cGxvYWRlci5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvbGliL3V0aWxzLnRzIiwibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvbGliL2ltYWdlLXVwbG9hZGVyLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LWltYWdlLXVwbG9hZGVyL2xpYi9pbWFnZS11cGxvYWRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cFJlc3BvbnNlLCBIdHRwRXJyb3JSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBGaWxlUXVldWVTdGF0dXMgfSBmcm9tICcuL2ZpbGUtcXVldWUtc3RhdHVzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWxlUXVldWVPYmplY3Qge1xyXG4gIHB1YmxpYyBmaWxlOiBhbnk7XHJcbiAgcHVibGljIHN0YXR1czogRmlsZVF1ZXVlU3RhdHVzID0gRmlsZVF1ZXVlU3RhdHVzLlBlbmRpbmc7XHJcbiAgcHVibGljIHByb2dyZXNzOiBudW1iZXIgPSAwO1xyXG4gIHB1YmxpYyByZXF1ZXN0OiBTdWJzY3JpcHRpb24gPSBudWxsO1xyXG4gIHB1YmxpYyByZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4gfCBIdHRwRXJyb3JSZXNwb25zZSA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGZpbGU6IGFueSkge1xyXG4gICAgdGhpcy5maWxlID0gZmlsZTtcclxuICB9XHJcblxyXG4gIC8vIGFjdGlvbnNcclxuICAvLyBwdWJsaWMgdXBsb2FkID0gKCkgPT4geyAvKiBzZXQgaW4gc2VydmljZSAqLyB9O1xyXG4gIC8vIHB1YmxpYyBjYW5jZWwgPSAoKSA9PiB7IC8qIHNldCBpbiBzZXJ2aWNlICovIH07XHJcbiAgLy8gcHVibGljIHJlbW92ZSA9ICgpID0+IHsgLyogc2V0IGluIHNlcnZpY2UgKi8gfTtcclxuXHJcbiAgLy8gc3RhdHVzZXNcclxuICBwdWJsaWMgaXNQZW5kaW5nID0gKCkgPT4gdGhpcy5zdGF0dXMgPT09IEZpbGVRdWV1ZVN0YXR1cy5QZW5kaW5nO1xyXG4gIHB1YmxpYyBpc1N1Y2Nlc3MgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlN1Y2Nlc3M7XHJcbiAgcHVibGljIGlzRXJyb3IgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLkVycm9yO1xyXG4gIHB1YmxpYyBpblByb2dyZXNzID0gKCkgPT4gdGhpcy5zdGF0dXMgPT09IEZpbGVRdWV1ZVN0YXR1cy5Qcm9ncmVzcztcclxuICBwdWJsaWMgaXNVcGxvYWRhYmxlID0gKCkgPT4gdGhpcy5zdGF0dXMgPT09IEZpbGVRdWV1ZVN0YXR1cy5QZW5kaW5nIHx8IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuRXJyb3I7XHJcbn1cclxuIiwiaW1wb3J0IHsgT2JzZXJ2ZXIsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCwgSHR0cEV2ZW50VHlwZSwgSHR0cFJlc3BvbnNlLCBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5pbXBvcnQgeyBGaWxlUXVldWVPYmplY3QgfSBmcm9tICcuL2ZpbGUtcXVldWUtb2JqZWN0JztcclxuaW1wb3J0IHsgRmlsZVF1ZXVlU3RhdHVzIH0gZnJvbSAnLi9maWxlLXF1ZXVlLXN0YXR1cyc7XHJcbmltcG9ydCB7IEZpbGVVcGxvYWRlck9wdGlvbnMsIENyb3BPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkZXJTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7fVxyXG5cclxuICB1cGxvYWRGaWxlKGZpbGU6IEZpbGUsIG9wdGlvbnM6IEZpbGVVcGxvYWRlck9wdGlvbnMsIGNyb3BPcHRpb25zPzogQ3JvcE9wdGlvbnMpOiBPYnNlcnZhYmxlPEZpbGVRdWV1ZU9iamVjdD4ge1xyXG4gICAgdGhpcy5zZXREZWZhdWx0cyhvcHRpb25zKTtcclxuXHJcbiAgICBjb25zdCBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICBmb3JtLmFwcGVuZChvcHRpb25zLmZpZWxkTmFtZSwgZmlsZSwgZmlsZS5uYW1lKTtcclxuXHJcbiAgICBpZiAoY3JvcE9wdGlvbnMpIHtcclxuICAgICAgZm9ybS5hcHBlbmQoJ1gnLCBjcm9wT3B0aW9ucy54LnRvU3RyaW5nKCkpO1xyXG4gICAgICBmb3JtLmFwcGVuZCgnWScsIGNyb3BPcHRpb25zLnkudG9TdHJpbmcoKSk7XHJcbiAgICAgIGZvcm0uYXBwZW5kKCdXaWR0aCcsIGNyb3BPcHRpb25zLndpZHRoLnRvU3RyaW5nKCkpO1xyXG4gICAgICBmb3JtLmFwcGVuZCgnSGVpZ2h0JywgY3JvcE9wdGlvbnMuaGVpZ2h0LnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwbG9hZCBmaWxlIGFuZCByZXBvcnQgcHJvZ3Jlc3NcclxuICAgIGNvbnN0IHJlcSA9IG5ldyBIdHRwUmVxdWVzdCgnUE9TVCcsIG9wdGlvbnMudXBsb2FkVXJsLCBmb3JtLCB7XHJcbiAgICAgIHJlcG9ydFByb2dyZXNzOiB0cnVlLFxyXG4gICAgICB3aXRoQ3JlZGVudGlhbHM6IG9wdGlvbnMud2l0aENyZWRlbnRpYWxzLFxyXG4gICAgICBoZWFkZXJzOiB0aGlzLl9idWlsZEhlYWRlcnMob3B0aW9ucylcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShvYnMgPT4ge1xyXG4gICAgICBjb25zdCBxdWV1ZU9iaiA9IG5ldyBGaWxlUXVldWVPYmplY3QoZmlsZSk7XHJcblxyXG4gICAgICBxdWV1ZU9iai5yZXF1ZXN0ID0gdGhpcy5odHRwLnJlcXVlc3QocmVxKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChldmVudC50eXBlID09PSBIdHRwRXZlbnRUeXBlLlVwbG9hZFByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwbG9hZFByb2dyZXNzKHF1ZXVlT2JqLCBldmVudCk7XHJcbiAgICAgICAgICAgIG9icy5uZXh0KHF1ZXVlT2JqKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBsb2FkQ29tcGxldGUocXVldWVPYmosIGV2ZW50KTtcclxuICAgICAgICAgICAgb2JzLm5leHQocXVldWVPYmopO1xyXG4gICAgICAgICAgICBvYnMuY29tcGxldGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIChlcnI6IEh0dHBFcnJvclJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyLmVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgLy8gQSBjbGllbnQtc2lkZSBvciBuZXR3b3JrIGVycm9yIG9jY3VycmVkLiBIYW5kbGUgaXQgYWNjb3JkaW5nbHkuXHJcbiAgICAgICAgICAgIHRoaXMuX3VwbG9hZEZhaWxlZChxdWV1ZU9iaiwgZXJyKTtcclxuICAgICAgICAgICAgb2JzLm5leHQocXVldWVPYmopO1xyXG4gICAgICAgICAgICBvYnMuY29tcGxldGUoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRoZSBiYWNrZW5kIHJldHVybmVkIGFuIHVuc3VjY2Vzc2Z1bCByZXNwb25zZSBjb2RlLlxyXG4gICAgICAgICAgICB0aGlzLl91cGxvYWRGYWlsZWQocXVldWVPYmosIGVycik7XHJcbiAgICAgICAgICAgIG9icy5uZXh0KHF1ZXVlT2JqKTtcclxuICAgICAgICAgICAgb2JzLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRGaWxlKHVybDogc3RyaW5nLCBvcHRpb25zOiB7IGF1dGhUb2tlbj86IHN0cmluZywgYXV0aFRva2VuUHJlZml4Pzogc3RyaW5nIH0pOiBPYnNlcnZhYmxlPEZpbGU+IHtcclxuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZSgob2JzZXJ2ZXI6IE9ic2VydmVyPEZpbGU+KSA9PiB7XHJcbiAgICAgIGxldCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5hdXRoVG9rZW4pIHtcclxuICAgICAgICBoZWFkZXJzID0gaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCBgJHtvcHRpb25zLmF1dGhUb2tlblByZWZpeH0gJHtvcHRpb25zLmF1dGhUb2tlbn1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5odHRwLmdldCh1cmwsIHsgcmVzcG9uc2VUeXBlOiAnYmxvYicsIGhlYWRlcnM6IGhlYWRlcnN9KS5zdWJzY3JpYmUocmVzID0+IHtcclxuICAgICAgICBjb25zdCBmaWxlID0gbmV3IEZpbGUoW3Jlc10sICdmaWxlbmFtZScsIHsgdHlwZTogcmVzLnR5cGUgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChmaWxlKTtcclxuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICB9LCBlcnIgPT4ge1xyXG4gICAgICAgIG9ic2VydmVyLmVycm9yKGVyci5zdGF0dXMpO1xyXG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9idWlsZEhlYWRlcnMob3B0aW9uczogRmlsZVVwbG9hZGVyT3B0aW9ucyk6IEh0dHBIZWFkZXJzIHtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuYXV0aFRva2VuKSB7XHJcbiAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsIGAke29wdGlvbnMuYXV0aFRva2VuUHJlZml4fSAke29wdGlvbnMuYXV0aFRva2VufWApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmN1c3RvbUhlYWRlcnMpIHtcclxuICAgICAgT2JqZWN0LmtleXMob3B0aW9ucy5jdXN0b21IZWFkZXJzKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICBoZWFkZXJzID0gaGVhZGVycy5hcHBlbmQoa2V5LCBvcHRpb25zLmN1c3RvbUhlYWRlcnNba2V5XSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoZWFkZXJzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdXBsb2FkUHJvZ3Jlc3MocXVldWVPYmo6IEZpbGVRdWV1ZU9iamVjdCwgZXZlbnQ6IGFueSkge1xyXG4gICAgLy8gdXBkYXRlIHRoZSBGaWxlUXVldWVPYmplY3Qgd2l0aCB0aGUgY3VycmVudCBwcm9ncmVzc1xyXG4gICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKDEwMCAqIGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsKTtcclxuICAgIHF1ZXVlT2JqLnByb2dyZXNzID0gcHJvZ3Jlc3M7XHJcbiAgICBxdWV1ZU9iai5zdGF0dXMgPSBGaWxlUXVldWVTdGF0dXMuUHJvZ3Jlc3M7XHJcbiAgICAvLyB0aGlzLl9xdWV1ZS5uZXh0KHRoaXMuX2ZpbGVzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3VwbG9hZENvbXBsZXRlKHF1ZXVlT2JqOiBGaWxlUXVldWVPYmplY3QsIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55Pikge1xyXG4gICAgLy8gdXBkYXRlIHRoZSBGaWxlUXVldWVPYmplY3QgYXMgY29tcGxldGVkXHJcbiAgICBxdWV1ZU9iai5wcm9ncmVzcyA9IDEwMDtcclxuICAgIHF1ZXVlT2JqLnN0YXR1cyA9IEZpbGVRdWV1ZVN0YXR1cy5TdWNjZXNzO1xyXG4gICAgcXVldWVPYmoucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgIC8vIHRoaXMuX3F1ZXVlLm5leHQodGhpcy5fZmlsZXMpO1xyXG4gICAgLy8gdGhpcy5vbkNvbXBsZXRlSXRlbShxdWV1ZU9iaiwgcmVzcG9uc2UuYm9keSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF91cGxvYWRGYWlsZWQocXVldWVPYmo6IEZpbGVRdWV1ZU9iamVjdCwgcmVzcG9uc2U6IEh0dHBFcnJvclJlc3BvbnNlKSB7XHJcbiAgICAvLyB1cGRhdGUgdGhlIEZpbGVRdWV1ZU9iamVjdCBhcyBlcnJvcmVkXHJcbiAgICBxdWV1ZU9iai5wcm9ncmVzcyA9IDA7XHJcbiAgICBxdWV1ZU9iai5zdGF0dXMgPSBGaWxlUXVldWVTdGF0dXMuRXJyb3I7XHJcbiAgICBxdWV1ZU9iai5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgLy8gdGhpcy5fcXVldWUubmV4dCh0aGlzLl9maWxlcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldERlZmF1bHRzKG9wdGlvbnM6IEZpbGVVcGxvYWRlck9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgfHwgZmFsc2U7XHJcbiAgICBvcHRpb25zLmh0dHBNZXRob2QgPSBvcHRpb25zLmh0dHBNZXRob2QgfHwgJ1BPU1QnO1xyXG4gICAgb3B0aW9ucy5hdXRoVG9rZW5QcmVmaXggPSBvcHRpb25zLmF1dGhUb2tlblByZWZpeCB8fCAnQmVhcmVyJztcclxuICAgIG9wdGlvbnMuZmllbGROYW1lID0gb3B0aW9ucy5maWVsZE5hbWUgfHwgJ2ZpbGUnO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1Jlc2l6ZU9wdGlvbnN9IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1hZ2UodXJsOiBzdHJpbmcsIGNiOiAoaTogSFRNTEltYWdlRWxlbWVudCkgPT4gdm9pZCkge1xyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2IoaW1hZ2UpO1xyXG4gIH07XHJcbiAgaW1hZ2Uuc3JjID0gdXJsO1xyXG59XHJcblxyXG5jb25zdCByZXNpemVBcmVhSWQgPSAnaW1hZ2V1cGxvYWQtcmVzaXplLWFyZWEnO1xyXG5cclxuZnVuY3Rpb24gZ2V0UmVzaXplQXJlYSgpIHtcclxuICBsZXQgcmVzaXplQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJlc2l6ZUFyZWFJZCk7XHJcbiAgaWYgKCFyZXNpemVBcmVhKSB7XHJcbiAgICByZXNpemVBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICByZXNpemVBcmVhLmlkID0gcmVzaXplQXJlYUlkO1xyXG4gICAgcmVzaXplQXJlYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZXNpemVBcmVhKTtcclxuICB9XHJcblxyXG4gIHJldHVybiA8SFRNTENhbnZhc0VsZW1lbnQ+cmVzaXplQXJlYTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZUltYWdlKG9yaWdJbWFnZTogSFRNTEltYWdlRWxlbWVudCwge1xyXG4gIHJlc2l6ZUhlaWdodCxcclxuICByZXNpemVXaWR0aCxcclxuICByZXNpemVRdWFsaXR5ID0gMC43LFxyXG4gIHJlc2l6ZVR5cGUgPSAnaW1hZ2UvanBlZycsXHJcbiAgcmVzaXplTW9kZSA9ICdmaWxsJ1xyXG59OiBSZXNpemVPcHRpb25zID0ge30pIHtcclxuXHJcbiAgY29uc3QgY2FudmFzID0gZ2V0UmVzaXplQXJlYSgpO1xyXG5cclxuICBsZXQgaGVpZ2h0ID0gb3JpZ0ltYWdlLmhlaWdodDtcclxuICBsZXQgd2lkdGggPSBvcmlnSW1hZ2Uud2lkdGg7XHJcbiAgbGV0IG9mZnNldFggPSAwO1xyXG4gIGxldCBvZmZzZXRZID0gMDtcclxuXHJcbiAgaWYgKHJlc2l6ZU1vZGUgPT09ICdmaWxsJykge1xyXG4gICAgLy8gY2FsY3VsYXRlIHRoZSB3aWR0aCBhbmQgaGVpZ2h0LCBjb25zdHJhaW5pbmcgdGhlIHByb3BvcnRpb25zXHJcbiAgICBpZiAod2lkdGggLyBoZWlnaHQgPiByZXNpemVXaWR0aCAvIHJlc2l6ZUhlaWdodCkge1xyXG4gICAgICB3aWR0aCA9IE1hdGgucm91bmQoaGVpZ2h0ICogcmVzaXplV2lkdGggLyByZXNpemVIZWlnaHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaGVpZ2h0ID0gTWF0aC5yb3VuZCh3aWR0aCAqIHJlc2l6ZUhlaWdodCAvIHJlc2l6ZVdpZHRoKTtcclxuICAgIH1cclxuXHJcbiAgICBjYW52YXMud2lkdGggPSByZXNpemVXaWR0aCA8PSB3aWR0aCA/IHJlc2l6ZVdpZHRoIDogd2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gcmVzaXplSGVpZ2h0IDw9IGhlaWdodCA/IHJlc2l6ZUhlaWdodCA6IGhlaWdodDtcclxuXHJcbiAgICBvZmZzZXRYID0gb3JpZ0ltYWdlLndpZHRoIC8gMiAtIHdpZHRoIC8gMjtcclxuICAgIG9mZnNldFkgPSBvcmlnSW1hZ2UuaGVpZ2h0IC8gMiAtIGhlaWdodCAvIDI7XHJcblxyXG4gICAgLy8gZHJhdyBpbWFnZSBvbiBjYW52YXNcclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgY3R4LmRyYXdJbWFnZShvcmlnSW1hZ2UsIG9mZnNldFgsIG9mZnNldFksIHdpZHRoLCBoZWlnaHQsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgfSBlbHNlIGlmIChyZXNpemVNb2RlID09PSAnZml0Jykge1xyXG4gICAgICAvLyBjYWxjdWxhdGUgdGhlIHdpZHRoIGFuZCBoZWlnaHQsIGNvbnN0cmFpbmluZyB0aGUgcHJvcG9ydGlvbnNcclxuICAgICAgaWYgKHdpZHRoID4gaGVpZ2h0KSB7XHJcbiAgICAgICAgICBpZiAod2lkdGggPiByZXNpemVXaWR0aCkge1xyXG4gICAgICAgICAgICAgIGhlaWdodCA9IE1hdGgucm91bmQoaGVpZ2h0ICo9IHJlc2l6ZVdpZHRoIC8gd2lkdGgpO1xyXG4gICAgICAgICAgICAgIHdpZHRoID0gcmVzaXplV2lkdGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoaGVpZ2h0ID4gcmVzaXplSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgd2lkdGggPSBNYXRoLnJvdW5kKHdpZHRoICo9IHJlc2l6ZUhlaWdodCAvIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgaGVpZ2h0ID0gcmVzaXplSGVpZ2h0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgIC8vIGRyYXcgaW1hZ2Ugb24gY2FudmFzXHJcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICBjdHguZHJhd0ltYWdlKG9yaWdJbWFnZSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biByZXNpemVNb2RlOiAnICsgcmVzaXplTW9kZSk7XHJcbiAgfVxyXG5cclxuICAvLyBnZXQgdGhlIGRhdGEgZnJvbSBjYW52YXMgYXMgNzAlIGpwZyAob3Igc3BlY2lmaWVkIHR5cGUpLlxyXG4gIHJldHVybiBjYW52YXMudG9EYXRhVVJMKHJlc2l6ZVR5cGUsIHJlc2l6ZVF1YWxpdHkpO1xyXG59XHJcblxyXG5cclxuIiwiaW1wb3J0IHtcclxuICBDb21wb25lbnQsIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdDaGVja2VkLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsXHJcbiAgUmVuZGVyZXIsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgQ2hhbmdlRGV0ZWN0b3JSZWYsIGZvcndhcmRSZWYsIEhvc3RMaXN0ZW5lclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCBDcm9wcGVyIGZyb20gJ2Nyb3BwZXJqcyc7XHJcblxyXG5pbXBvcnQgeyBJbWFnZVVwbG9hZGVyU2VydmljZSB9IGZyb20gJy4vaW1hZ2UtdXBsb2FkZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEltYWdlVXBsb2FkZXJPcHRpb25zLCBJbWFnZVJlc3VsdCwgUmVzaXplT3B0aW9ucywgQ3JvcE9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBjcmVhdGVJbWFnZSwgcmVzaXplSW1hZ2UgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgRmlsZVF1ZXVlT2JqZWN0IH0gZnJvbSAnLi9maWxlLXF1ZXVlLW9iamVjdCc7XHJcblxyXG5leHBvcnQgZW51bSBTdGF0dXMge1xyXG4gIE5vdFNlbGVjdGVkLFxyXG4gIFNlbGVjdGVkLFxyXG4gIFVwbG9hZGluZyxcclxuICBMb2FkaW5nLFxyXG4gIExvYWRlZCxcclxuICBFcnJvclxyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1pbWFnZS11cGxvYWRlcicsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiaW1hZ2UtY29udGFpbmVyXCI+XHJcbiAgPGRpdiBjbGFzcz1cIm1hdGNoLXBhcmVudFwiIFtuZ1N3aXRjaF09XCJzdGF0dXNcIj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwibWF0Y2gtcGFyZW50XCIgKm5nU3dpdGNoQ2FzZT1cInN0YXR1c0VudW0uTm90U2VsZWN0ZWRcIj5cclxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJhZGQtaW1hZ2UtYnRuXCIgKGNsaWNrKT1cIm9uSW1hZ2VDbGlja2VkKClcIj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzPVwicGx1c1wiPis8L3A+XHJcbiAgICAgICAgICAgIDxwPkNsaWNrIGhlcmUgdG8gYWRkIGltYWdlPC9wPlxyXG4gICAgICAgICAgICA8cD5PciBkcm9wIGltYWdlIGhlcmU8L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2VsZWN0ZWQtc3RhdHVzLXdyYXBwZXIgbWF0Y2gtcGFyZW50XCIgKm5nU3dpdGNoQ2FzZT1cInN0YXR1c0VudW0uTG9hZGVkXCI+XHJcbiAgICAgIDxpbWcgW3NyY109XCJpbWFnZVRodW1ibmFpbFwiICNpbWFnZUVsZW1lbnQ+XHJcblxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInJlbW92ZVwiIChjbGljayk9XCJyZW1vdmVJbWFnZSgpXCI+w4PClzwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInNlbGVjdGVkLXN0YXR1cy13cmFwcGVyIG1hdGNoLXBhcmVudFwiICpuZ1N3aXRjaENhc2U9XCJzdGF0dXNFbnVtLlNlbGVjdGVkXCI+XHJcbiAgICAgIDxpbWcgW3NyY109XCJpbWFnZVRodW1ibmFpbFwiICNpbWFnZUVsZW1lbnQ+XHJcblxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInJlbW92ZVwiIChjbGljayk9XCJyZW1vdmVJbWFnZSgpXCI+w4PClzwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiAqbmdTd2l0Y2hDYXNlPVwic3RhdHVzRW51bS5VcGxvYWRpbmdcIj5cclxuICAgICAgPGltZyBbYXR0ci5zcmNdPVwiaW1hZ2VUaHVtYm5haWwgPyBpbWFnZVRodW1ibmFpbCA6IG51bGxcIiAoY2xpY2spPVwib25JbWFnZUNsaWNrZWQoKVwiPlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJiYXJcIiBbc3R5bGUud2lkdGhdPVwicHJvZ3Jlc3MrJyUnXCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cIm1hdGNoLXBhcmVudFwiICpuZ1N3aXRjaENhc2U9XCJzdGF0dXNFbnVtLkxvYWRpbmdcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInNrLWZhZGluZy1jaXJjbGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMSBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMiBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMyBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlNCBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlNSBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlNiBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlNyBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlOCBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlOSBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2stY2lyY2xlMTAgc2stY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZTExIHNrLWNpcmNsZVwiPjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzay1jaXJjbGUxMiBzay1jaXJjbGVcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwibWF0Y2gtcGFyZW50XCIgKm5nU3dpdGNoQ2FzZT1cInN0YXR1c0VudW0uRXJyb3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImVycm9yXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImVycm9yLW1lc3NhZ2VcIj5cclxuICAgICAgICAgIDxwPnt7ZXJyb3JNZXNzYWdlfX08L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJyZW1vdmVcIiAoY2xpY2spPVwiZGlzbWlzc0Vycm9yKClcIj7Dg8KXPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxpbnB1dCB0eXBlPVwiZmlsZVwiICNmaWxlSW5wdXQgKGNoYW5nZSk9XCJvbkZpbGVDaGFuZ2VkKClcIj5cclxuICA8ZGl2IGNsYXNzPVwiZHJhZy1vdmVybGF5XCIgW2hpZGRlbl09XCJ0cnVlXCIgI2RyYWdPdmVybGF5PjwvZGl2PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgOmhvc3R7ZGlzcGxheTpibG9ja30ubWF0Y2gtcGFyZW50e3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCV9LmFkZC1pbWFnZS1idG57d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtmb250LXdlaWdodDo3MDA7b3BhY2l0eTouNTtib3JkZXI6MH0uYWRkLWltYWdlLWJ0bjpob3ZlcntvcGFjaXR5Oi43O2N1cnNvcjpwb2ludGVyO2JhY2tncm91bmQtY29sb3I6I2RkZDtib3gtc2hhZG93Omluc2V0IDAgMCA1cHggcmdiYSgwLDAsMCwuMyl9LmFkZC1pbWFnZS1idG4gLnBsdXN7Zm9udC1zaXplOjMwcHg7Zm9udC13ZWlnaHQ6NDAwO21hcmdpbi1ib3R0b206NXB4O21hcmdpbi10b3A6NXB4fWltZ3tjdXJzb3I6cG9pbnRlcjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO2xlZnQ6NTAlO21hcmdpbi1yaWdodDotNTAlOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTttYXgtd2lkdGg6MTAwJX0uaW1hZ2UtY29udGFpbmVye3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7cG9zaXRpb246cmVsYXRpdmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZC1jb2xvcjojZjFmMWYxO2JveC1zaGFkb3c6aW5zZXQgMCAwIDVweCByZ2JhKDAsMCwwLC4yKX0ucmVtb3Zle3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO3JpZ2h0OjA7d2lkdGg6NDBweDtoZWlnaHQ6NDBweDtmb250LXNpemU6MjVweDt0ZXh0LWFsaWduOmNlbnRlcjtvcGFjaXR5Oi44O2JvcmRlcjowO2N1cnNvcjpwb2ludGVyfS5zZWxlY3RlZC1zdGF0dXMtd3JhcHBlcj4ucmVtb3ZlOmhvdmVye29wYWNpdHk6Ljc7YmFja2dyb3VuZC1jb2xvcjojZmZmfS5lcnJvciAucmVtb3Zle29wYWNpdHk6LjV9LmVycm9yIC5yZW1vdmU6aG92ZXJ7b3BhY2l0eTouN31pbnB1dHtkaXNwbGF5Om5vbmV9LmVycm9ye3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7Ym9yZGVyOjFweCBzb2xpZCAjZTNhNWEyO2NvbG9yOiNkMjcwNmI7YmFja2dyb3VuZC1jb2xvcjojZmJmMWYwO3Bvc2l0aW9uOnJlbGF0aXZlO3RleHQtYWxpZ246Y2VudGVyO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXJ9LmVycm9yLW1lc3NhZ2V7d2lkdGg6MTAwJTtsaW5lLWhlaWdodDoxOHB4fS5wcm9ncmVzcy1iYXJ7cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjEwJTtsZWZ0OjEwJTt3aWR0aDo4MCU7aGVpZ2h0OjVweDtiYWNrZ3JvdW5kLWNvbG9yOmdyZXk7b3BhY2l0eTouOTtvdmVyZmxvdzpoaWRkZW59LmJhcntwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTtiYWNrZ3JvdW5kLWNvbG9yOiNhNGM2Mzl9LmRyYWctb3ZlcmxheXtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtiYWNrZ3JvdW5kLWNvbG9yOiNmZjA7b3BhY2l0eTouM30uc2stZmFkaW5nLWNpcmNsZXt3aWR0aDo0MHB4O2hlaWdodDo0MHB4O3Bvc2l0aW9uOnJlbGF0aXZlO3RvcDo1MCU7bGVmdDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGV7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjA7dG9wOjB9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTpiZWZvcmV7Y29udGVudDonJztkaXNwbGF5OmJsb2NrO21hcmdpbjowIGF1dG87d2lkdGg6MTUlO2hlaWdodDoxNSU7YmFja2dyb3VuZC1jb2xvcjojMzMzO2JvcmRlci1yYWRpdXM6MTAwJTstd2Via2l0LWFuaW1hdGlvbjoxLjJzIGVhc2UtaW4tb3V0IGluZmluaXRlIGJvdGggc2stY2lyY2xlRmFkZURlbGF5O2FuaW1hdGlvbjoxLjJzIGVhc2UtaW4tb3V0IGluZmluaXRlIGJvdGggc2stY2lyY2xlRmFkZURlbGF5fS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUyey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgzMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgzMGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTN7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDYwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDYwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNHstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoOTBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU1ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgxMjBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMTIwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlNnstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMTUwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDE1MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTd7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDE4MGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgxODBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGU4ey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgyMTBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMjEwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlOXstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMjQwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDI0MGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTEwey13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSgyNzBkZWcpO3RyYW5zZm9ybTpyb3RhdGUoMjcwZGVnKX0uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTF7LXdlYmtpdC10cmFuc2Zvcm06cm90YXRlKDMwMGRlZyk7dHJhbnNmb3JtOnJvdGF0ZSgzMDBkZWcpfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMnstd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoMzMwZGVnKTt0cmFuc2Zvcm06cm90YXRlKDMzMGRlZyl9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTI6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0xLjFzO2FuaW1hdGlvbi1kZWxheTotMS4xc30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMzpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LTFzO2FuaW1hdGlvbi1kZWxheTotMXN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTQ6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uOXM7YW5pbWF0aW9uLWRlbGF5Oi0uOXN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTU6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uOHM7YW5pbWF0aW9uLWRlbGF5Oi0uOHN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTY6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uN3M7YW5pbWF0aW9uLWRlbGF5Oi0uN3N9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTc6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uNnM7YW5pbWF0aW9uLWRlbGF5Oi0uNnN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTg6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uNXM7YW5pbWF0aW9uLWRlbGF5Oi0uNXN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTk6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uNHM7YW5pbWF0aW9uLWRlbGF5Oi0uNHN9LnNrLWZhZGluZy1jaXJjbGUgLnNrLWNpcmNsZTEwOmJlZm9yZXstd2Via2l0LWFuaW1hdGlvbi1kZWxheTotLjNzO2FuaW1hdGlvbi1kZWxheTotLjNzfS5zay1mYWRpbmctY2lyY2xlIC5zay1jaXJjbGUxMTpiZWZvcmV7LXdlYmtpdC1hbmltYXRpb24tZGVsYXk6LS4yczthbmltYXRpb24tZGVsYXk6LS4yc30uc2stZmFkaW5nLWNpcmNsZSAuc2stY2lyY2xlMTI6YmVmb3Jley13ZWJraXQtYW5pbWF0aW9uLWRlbGF5Oi0uMXM7YW5pbWF0aW9uLWRlbGF5Oi0uMXN9QC13ZWJraXQta2V5ZnJhbWVzIHNrLWNpcmNsZUZhZGVEZWxheXswJSwxMDAlLDM5JXtvcGFjaXR5OjB9NDAle29wYWNpdHk6MX19QGtleWZyYW1lcyBzay1jaXJjbGVGYWRlRGVsYXl7MCUsMTAwJSwzOSV7b3BhY2l0eTowfTQwJXtvcGFjaXR5OjF9fWBdLFxyXG4gIGhvc3Q6IHtcclxuICAgICdbc3R5bGUud2lkdGhdJzogJ3RodW1ibmFpbFdpZHRoICsgXCJweFwiJyxcclxuICAgICdbc3R5bGUuaGVpZ2h0XSc6ICd0aHVtYm5haWxIZWlnaHQgKyBcInB4XCInXHJcbiAgfSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEltYWdlVXBsb2FkZXJDb21wb25lbnQpLFxyXG4gICAgICBtdWx0aTogdHJ1ZVxyXG4gICAgfVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3Q2hlY2tlZCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG4gIHN0YXR1c0VudW0gPSBTdGF0dXM7XHJcbiAgX3N0YXR1czogU3RhdHVzID0gU3RhdHVzLk5vdFNlbGVjdGVkO1xyXG5cclxuICB0aHVtYm5haWxXaWR0aCA9IDE1MDtcclxuICB0aHVtYm5haWxIZWlnaHQgPSAxNTA7XHJcbiAgX2ltYWdlVGh1bWJuYWlsOiBhbnk7XHJcbiAgX2Vycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gIHByb2dyZXNzOiBudW1iZXI7XHJcbiAgb3JpZ0ltYWdlV2lkdGg6IG51bWJlcjtcclxuICBvcmdpSW1hZ2VIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgY3JvcHBlcjogQ3JvcHBlciA9IHVuZGVmaW5lZDtcclxuICBmaWxlVG9VcGxvYWQ6IEZpbGU7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ2ltYWdlRWxlbWVudCcpIGltYWdlRWxlbWVudDogRWxlbWVudFJlZjtcclxuICBAVmlld0NoaWxkKCdmaWxlSW5wdXQnKSBmaWxlSW5wdXRFbGVtZW50OiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2RyYWdPdmVybGF5JykgZHJhZ092ZXJsYXlFbGVtZW50OiBFbGVtZW50UmVmO1xyXG4gIEBJbnB1dCgpIG9wdGlvbnM6IEltYWdlVXBsb2FkZXJPcHRpb25zO1xyXG4gIEBPdXRwdXQoKSB1cGxvYWQ6IEV2ZW50RW1pdHRlcjxGaWxlUXVldWVPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxGaWxlUXVldWVPYmplY3Q+KCk7XHJcbiAgQE91dHB1dCgpIHN0YXR1c0NoYW5nZTogRXZlbnRFbWl0dGVyPFN0YXR1cz4gPSBuZXcgRXZlbnRFbWl0dGVyPFN0YXR1cz4oKTtcclxuXHJcbiAgcHJvcGFnYXRlQ2hhbmdlID0gKF86IGFueSkgPT4ge307XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIsXHJcbiAgICBwcml2YXRlIHVwbG9hZGVyOiBJbWFnZVVwbG9hZGVyU2VydmljZSxcclxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7IH1cclxuXHJcbiAgZ2V0IGltYWdlVGh1bWJuYWlsKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2ltYWdlVGh1bWJuYWlsO1xyXG4gIH1cclxuXHJcbiAgc2V0IGltYWdlVGh1bWJuYWlsKHZhbHVlKSB7XHJcbiAgICB0aGlzLl9pbWFnZVRodW1ibmFpbCA9IHZhbHVlO1xyXG4gICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UodGhpcy5faW1hZ2VUaHVtYm5haWwpO1xyXG5cclxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLlNlbGVjdGVkO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTm90U2VsZWN0ZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgZXJyb3JNZXNzYWdlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Vycm9yTWVzc2FnZTtcclxuICB9XHJcblxyXG4gIHNldCBlcnJvck1lc3NhZ2UodmFsdWUpIHtcclxuICAgIHRoaXMuX2Vycm9yTWVzc2FnZSA9IHZhbHVlO1xyXG5cclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5FcnJvcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLk5vdFNlbGVjdGVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IHN0YXR1cygpIHtcclxuICAgIHJldHVybiB0aGlzLl9zdGF0dXM7XHJcbiAgfVxyXG5cclxuICBzZXQgc3RhdHVzKHZhbHVlKSB7XHJcbiAgICB0aGlzLl9zdGF0dXMgPSB2YWx1ZTtcclxuICAgIHRoaXMuc3RhdHVzQ2hhbmdlLmVtaXQodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgdGhpcy5sb2FkQW5kUmVzaXplKHZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gdW5kZWZpbmVkO1xyXG4gICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5Ob3RTZWxlY3RlZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlID0gZm47XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck9uVG91Y2hlZCgpIHt9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRodW1ibmFpbFdpZHRoKSB7XHJcbiAgICAgICAgdGhpcy50aHVtYm5haWxXaWR0aCA9IHRoaXMub3B0aW9ucy50aHVtYm5haWxXaWR0aDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRodW1ibmFpbEhlaWdodCkge1xyXG4gICAgICAgIHRoaXMudGh1bWJuYWlsSGVpZ2h0ID0gdGhpcy5vcHRpb25zLnRodW1ibmFpbEhlaWdodDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnJlc2l6ZU9uTG9hZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnJlc2l6ZU9uTG9hZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvVXBsb2FkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuYXV0b1VwbG9hZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jcm9wRW5hYmxlZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmNyb3BFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1VwbG9hZCAmJiB0aGlzLm9wdGlvbnMuY3JvcEVuYWJsZWQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2F1dG9VcGxvYWQgYW5kIGNyb3BFbmFibGVkIGNhbm5vdCBiZSBlbmFibGVkIHNpbXVsdGFuZW91c2x5Jyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmNyb3BFbmFibGVkICYmIHRoaXMuaW1hZ2VFbGVtZW50ICYmIHRoaXMuZmlsZVRvVXBsb2FkICYmICF0aGlzLmNyb3BwZXIpIHtcclxuICAgICAgdGhpcy5jcm9wcGVyID0gbmV3IENyb3BwZXIodGhpcy5pbWFnZUVsZW1lbnQubmF0aXZlRWxlbWVudCwge1xyXG4gICAgICAgIHZpZXdNb2RlOiAxLFxyXG4gICAgICAgIGFzcGVjdFJhdGlvOiB0aGlzLm9wdGlvbnMuY3JvcEFzcGVjdFJhdGlvID8gdGhpcy5vcHRpb25zLmNyb3BBc3BlY3RSYXRpbyA6IG51bGxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLmNyb3BwZXIpIHtcclxuICAgICAgdGhpcy5jcm9wcGVyLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5jcm9wcGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWRBbmRSZXNpemUodXJsOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLkxvYWRpbmc7XHJcblxyXG4gICAgdGhpcy51cGxvYWRlci5nZXRGaWxlKHVybCwgdGhpcy5vcHRpb25zKS5zdWJzY3JpYmUoZmlsZSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVzaXplT25Mb2FkKSB7XHJcbiAgICAgICAgLy8gdGh1bWJuYWlsXHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJbWFnZVJlc3VsdCA9IHtcclxuICAgICAgICAgIGZpbGU6IGZpbGUsXHJcbiAgICAgICAgICB1cmw6IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlc2l6ZShyZXN1bHQpLnRoZW4ociA9PiB7XHJcbiAgICAgICAgICB0aGlzLl9pbWFnZVRodW1ibmFpbCA9IHIucmVzaXplZC5kYXRhVVJMO1xyXG4gICAgICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTG9hZGVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogSW1hZ2VSZXN1bHQgPSB7XHJcbiAgICAgICAgICBmaWxlOiBudWxsLFxyXG4gICAgICAgICAgdXJsOiBudWxsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5maWxlVG9EYXRhVVJMKGZpbGUsIHJlc3VsdCkudGhlbihyID0+IHtcclxuICAgICAgICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gci5kYXRhVVJMO1xyXG4gICAgICAgICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuTG9hZGVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCBlcnJvciA9PiB7XHJcbiAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gZXJyb3IgfHwgJ0Vycm9yIHdoaWxlIGdldHRpbmcgYW4gaW1hZ2UnO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkltYWdlQ2xpY2tlZCgpIHtcclxuICAgIHRoaXMucmVuZGVyZXIuaW52b2tlRWxlbWVudE1ldGhvZCh0aGlzLmZpbGVJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2NsaWNrJyk7XHJcbiAgfVxyXG5cclxuICBvbkZpbGVDaGFuZ2VkKCkge1xyXG4gICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmZpbGVzWzBdO1xyXG4gICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZhbGlkYXRlQW5kVXBsb2FkKGZpbGUpO1xyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGVBbmRVcGxvYWQoZmlsZTogRmlsZSkge1xyXG4gICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UobnVsbCk7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuYWxsb3dlZEltYWdlVHlwZXMpIHtcclxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYWxsb3dlZEltYWdlVHlwZXMuc29tZShhbGxvd2VkVHlwZSA9PiBmaWxlLnR5cGUgPT09IGFsbG93ZWRUeXBlKSkge1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gJ09ubHkgdGhlc2UgaW1hZ2UgdHlwZXMgYXJlIGFsbG93ZWQ6ICcgKyB0aGlzLm9wdGlvbnMuYWxsb3dlZEltYWdlVHlwZXMuam9pbignLCAnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5tYXhJbWFnZVNpemUpIHtcclxuICAgICAgaWYgKGZpbGUuc2l6ZSA+IHRoaXMub3B0aW9ucy5tYXhJbWFnZVNpemUgKiAxMDI0ICogMTAyNCkge1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gYEltYWdlIG11c3Qgbm90IGJlIGxhcmdlciB0aGFuICR7dGhpcy5vcHRpb25zLm1heEltYWdlU2l6ZX0gTUJgO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZmlsZVRvVXBsb2FkID0gZmlsZTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5hdXRvVXBsb2FkKSB7XHJcbiAgICAgIHRoaXMudXBsb2FkSW1hZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aHVtYm5haWxcclxuICAgIGNvbnN0IHJlc3VsdDogSW1hZ2VSZXN1bHQgPSB7XHJcbiAgICAgIGZpbGU6IGZpbGUsXHJcbiAgICAgIHVybDogVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlc2l6ZShyZXN1bHQpLnRoZW4ociA9PiB7XHJcbiAgICAgIHRoaXMuX2ltYWdlVGh1bWJuYWlsID0gci5yZXNpemVkLmRhdGFVUkw7XHJcbiAgICAgIHRoaXMub3JpZ0ltYWdlV2lkdGggPSByLndpZHRoO1xyXG4gICAgICB0aGlzLm9yZ2lJbWFnZUhlaWdodCA9IHIuaGVpZ2h0O1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucyAmJiAhdGhpcy5vcHRpb25zLmF1dG9VcGxvYWQpIHtcclxuICAgICAgICB0aGlzLnN0YXR1cyA9IFN0YXR1cy5TZWxlY3RlZDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGxvYWRJbWFnZSgpIHtcclxuICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xyXG4gICAgdGhpcy5zdGF0dXMgPSBTdGF0dXMuVXBsb2FkaW5nO1xyXG5cclxuICAgIGxldCBjcm9wT3B0aW9uczogQ3JvcE9wdGlvbnM7XHJcblxyXG4gICAgaWYgKHRoaXMuY3JvcHBlcikge1xyXG4gICAgICBjb25zdCBzY2FsZSA9IHRoaXMub3JpZ0ltYWdlV2lkdGggLyB0aGlzLmNyb3BwZXIuZ2V0SW1hZ2VEYXRhKCkubmF0dXJhbFdpZHRoO1xyXG4gICAgICBjb25zdCBjcm9wRGF0YSA9IHRoaXMuY3JvcHBlci5nZXREYXRhKCk7XHJcblxyXG4gICAgICBjcm9wT3B0aW9ucyA9IHtcclxuICAgICAgICB4OiBNYXRoLnJvdW5kKGNyb3BEYXRhLnggKiBzY2FsZSksXHJcbiAgICAgICAgeTogTWF0aC5yb3VuZChjcm9wRGF0YS55ICogc2NhbGUpLFxyXG4gICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKGNyb3BEYXRhLndpZHRoICogc2NhbGUpLFxyXG4gICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChjcm9wRGF0YS5oZWlnaHQgKiBzY2FsZSlcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgIC8vIGNvbnN0IHF1ZXVlT2JqID0gdGhpcy51cGxvYWRlci51cGxvYWRGaWxlKHRoaXMuZmlsZVRvVXBsb2FkLCB0aGlzLm9wdGlvbnMsIGNyb3BPcHRpb25zKTtcclxuXHJcbiAgICAvLyBmaWxlIHByb2dyZXNzXHJcbiAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZEZpbGUodGhpcy5maWxlVG9VcGxvYWQsIHRoaXMub3B0aW9ucywgY3JvcE9wdGlvbnMpLnN1YnNjcmliZShmaWxlID0+IHtcclxuICAgICAgdGhpcy5wcm9ncmVzcyA9IGZpbGUucHJvZ3Jlc3M7XHJcblxyXG4gICAgICBpZiAoZmlsZS5pc0Vycm9yKCkpIHtcclxuICAgICAgICBpZiAoZmlsZS5yZXNwb25zZS5zdGF0dXMgfHwgZmlsZS5yZXNwb25zZS5zdGF0dXNUZXh0KSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IGAke2ZpbGUucmVzcG9uc2Uuc3RhdHVzfTogJHtmaWxlLnJlc3BvbnNlLnN0YXR1c1RleHR9YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSAnRXJyb3Igd2hpbGUgdXBsb2FkaW5nJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gb24gc29tZSB1cGxvYWQgZXJyb3JzIGNoYW5nZSBkZXRlY3Rpb24gZG9lcyBub3Qgd29yaywgc28gd2UgYXJlIGZvcmNpbmcgbWFudWFsbHlcclxuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFmaWxlLmluUHJvZ3Jlc3MoKSkge1xyXG4gICAgICAgIC8vIG5vdGlmeSB0aGF0IHZhbHVlIHdhcyBjaGFuZ2VkIG9ubHkgd2hlbiBpbWFnZSB3YXMgdXBsb2FkZWQgYW5kIG5vIGVycm9yXHJcbiAgICAgICAgaWYgKGZpbGUuaXNTdWNjZXNzKCkpIHtcclxuICAgICAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlKHRoaXMuX2ltYWdlVGh1bWJuYWlsKTtcclxuICAgICAgICAgIHRoaXMuc3RhdHVzID0gU3RhdHVzLlNlbGVjdGVkO1xyXG4gICAgICAgICAgdGhpcy5maWxlVG9VcGxvYWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwbG9hZC5lbWl0KGZpbGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUltYWdlKCkge1xyXG4gICAgdGhpcy5maWxlSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBudWxsO1xyXG4gICAgdGhpcy5pbWFnZVRodW1ibmFpbCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBpZiAodGhpcy5jcm9wcGVyKSB7XHJcbiAgICAgIHRoaXMuY3JvcHBlci5kZXN0cm95KCk7XHJcbiAgICAgIHRoaXMuY3JvcHBlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXNtaXNzRXJyb3IoKSB7XHJcbiAgICB0aGlzLmVycm9yTWVzc2FnZSA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMucmVtb3ZlSW1hZ2UoKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKSBkcm9wKGU6IERyYWdFdmVudCkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICBpZiAoIWUuZGF0YVRyYW5zZmVyIHx8ICFlLmRhdGFUcmFuc2Zlci5maWxlcy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmFsaWRhdGVBbmRVcGxvYWQoZS5kYXRhVHJhbnNmZXIuZmlsZXNbMF0pO1xyXG4gICAgdGhpcy51cGRhdGVEcmFnT3ZlcmxheVN0eWxlcyhmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW50ZXInLCBbJyRldmVudCddKSBkcmFnZW50ZXIoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKSBkcmFnb3ZlcihlOiBEcmFnRXZlbnQpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB0aGlzLnVwZGF0ZURyYWdPdmVybGF5U3R5bGVzKHRydWUpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2xlYXZlJywgWyckZXZlbnQnXSkgZHJhZ2xlYXZlKGU6IERyYWdFdmVudCkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIHRoaXMudXBkYXRlRHJhZ092ZXJsYXlTdHlsZXMoZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVEcmFnT3ZlcmxheVN0eWxlcyhpc0RyYWdPdmVyOiBib29sZWFuKSB7XHJcbiAgICAvLyBUT0RPOiBmaW5kIGEgd2F5IHRoYXQgZG9lcyBub3QgdHJpZ2dlciBkcmFnbGVhdmUgd2hlbiBkaXNwbGF5aW5nIG92ZXJsYXlcclxuICAgIC8vIGlmIChpc0RyYWdPdmVyKSB7XHJcbiAgICAvLyAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5kcmFnT3ZlcmxheUVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgIC8vIH0gZWxzZSB7XHJcbiAgICAvLyAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5kcmFnT3ZlcmxheUVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgLy8gfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZXNpemUocmVzdWx0OiBJbWFnZVJlc3VsdCk6IFByb21pc2U8SW1hZ2VSZXN1bHQ+IHtcclxuICAgIGNvbnN0IHJlc2l6ZU9wdGlvbnM6IFJlc2l6ZU9wdGlvbnMgPSB7XHJcbiAgICAgIHJlc2l6ZUhlaWdodDogdGhpcy50aHVtYm5haWxIZWlnaHQsXHJcbiAgICAgIHJlc2l6ZVdpZHRoOiB0aGlzLnRodW1ibmFpbFdpZHRoLFxyXG4gICAgICByZXNpemVUeXBlOiByZXN1bHQuZmlsZS50eXBlLFxyXG4gICAgICByZXNpemVNb2RlOiB0aGlzLm9wdGlvbnMudGh1bWJuYWlsUmVzaXplTW9kZVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgY3JlYXRlSW1hZ2UocmVzdWx0LnVybCwgaW1hZ2UgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGFVcmwgPSByZXNpemVJbWFnZShpbWFnZSwgcmVzaXplT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHJlc3VsdC53aWR0aCA9IGltYWdlLndpZHRoO1xyXG4gICAgICAgIHJlc3VsdC5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgcmVzdWx0LnJlc2l6ZWQgPSB7XHJcbiAgICAgICAgICBkYXRhVVJMOiBkYXRhVXJsLFxyXG4gICAgICAgICAgdHlwZTogdGhpcy5nZXRUeXBlKGRhdGFVcmwpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRUeXBlKGRhdGFVcmw6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGRhdGFVcmwubWF0Y2goLzooLitcXC8uKzspLylbMV07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZpbGVUb0RhdGFVUkwoZmlsZTogRmlsZSwgcmVzdWx0OiBJbWFnZVJlc3VsdCk6IFByb21pc2U8SW1hZ2VSZXN1bHQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICByZXN1bHQuZGF0YVVSTCA9IHJlYWRlci5yZXN1bHQ7XHJcbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICB9O1xyXG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuaW1wb3J0IHsgSW1hZ2VVcGxvYWRlckNvbXBvbmVudCB9IGZyb20gJy4vaW1hZ2UtdXBsb2FkZXIuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgSHR0cENsaWVudE1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbSW1hZ2VVcGxvYWRlckNvbXBvbmVudF0sXHJcbiAgZXhwb3J0czogW0ltYWdlVXBsb2FkZXJDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVVwbG9hZGVyTW9kdWxlIHsgfVxyXG4iXSwibmFtZXMiOlsiSHR0cFJlcXVlc3QiLCJPYnNlcnZhYmxlIiwiSHR0cEV2ZW50VHlwZSIsIkh0dHBSZXNwb25zZSIsIkh0dHBIZWFkZXJzIiwiSW5qZWN0YWJsZSIsIkh0dHBDbGllbnQiLCJFdmVudEVtaXR0ZXIiLCJDb21wb25lbnQiLCJOR19WQUxVRV9BQ0NFU1NPUiIsImZvcndhcmRSZWYiLCJSZW5kZXJlciIsIkNoYW5nZURldGVjdG9yUmVmIiwiVmlld0NoaWxkIiwiSW5wdXQiLCJPdXRwdXQiLCJIb3N0TGlzdGVuZXIiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkh0dHBDbGllbnRNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQSxRQUVBO1FBT0UseUJBQVksSUFBUztZQUFyQixpQkFFQzswQkFQZ0MsZUFBZSxD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