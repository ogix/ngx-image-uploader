/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders } from '@angular/common/http';
import { FileQueueObject } from './file-queue-object';
import { FileQueueStatus } from './file-queue-status';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
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
    /** @nocollapse */ ImageUploaderService.ngInjectableDef = i0.defineInjectable({ factory: function ImageUploaderService_Factory() { return new ImageUploaderService(i0.inject(i1.HttpClient)); }, token: ImageUploaderService, providedIn: "root" });
    return ImageUploaderService;
}());
export { ImageUploaderService };
function ImageUploaderService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ImageUploaderService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ImageUploaderService.ctorParameters;
    /** @type {?} */
    ImageUploaderService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtdXBsb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1pbWFnZS11cGxvYWRlci8iLCJzb3VyY2VzIjpbImxpYi9pbWFnZS11cGxvYWRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQVksVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBcUIsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFNUgsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7OztJQVFwRCw4QkFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtLQUFJOzs7Ozs7O0lBRXhDLHlDQUFVOzs7Ozs7SUFBVixVQUFXLElBQVUsRUFBRSxPQUE0QixFQUFFLFdBQXlCO1FBQTlFLGlCQWlEQztRQWhEQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFCLHFCQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhELEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUMzQyxJ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QzlELFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzdCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQzs7Ozs7Ozs7SUFJckMsOENBQWU7Ozs7O2NBQUMsUUFBeUIsRUFBRSxRQUEyQjs7UUFFNUUsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDeEIsUUFBUSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7SUFLdkIsNENBQWE7Ozs7O2NBQUMsUUFBeUIsRUFBRSxRQUEyQjs7UUFFMUUsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDdEIsUUFBUSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO1FBQ3hDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOzs7Ozs7O0lBSXZCLDBDQUFXOzs7O2NBQUMsT0FBNEI7UUFDOUMsT0FBTyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxJQUFJLEtBQUssQ0FBQztRQUMzRCxPQUFPLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGVBQWUsSUFBSSxRQUFRLENBQUM7UUFDOUQsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQzs7O2dCQTFIbkQsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFSUSxVQUFVOzs7K0JBRm5COztTQVdhLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmVyLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cFJlcXVlc3QsIEh0dHBFdmVudFR5cGUsIEh0dHBSZXNwb25zZSwgSHR0cEVycm9yUmVzcG9uc2UsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5cclxuaW1wb3J0IHsgRmlsZVF1ZXVlT2JqZWN0IH0gZnJvbSAnLi9maWxlLXF1ZXVlLW9iamVjdCc7XHJcbmltcG9ydCB7IEZpbGVRdWV1ZVN0YXR1cyB9IGZyb20gJy4vZmlsZS1xdWV1ZS1zdGF0dXMnO1xyXG5pbXBvcnQgeyBGaWxlVXBsb2FkZXJPcHRpb25zLCBDcm9wT3B0aW9ucyB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJbWFnZVVwbG9hZGVyU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge31cclxuXHJcbiAgdXBsb2FkRmlsZShmaWxlOiBGaWxlLCBvcHRpb25zOiBGaWxlVXBsb2FkZXJPcHRpb25zLCBjcm9wT3B0aW9ucz86IENyb3BPcHRpb25zKTogT2JzZXJ2YWJsZTxGaWxlUXVldWVPYmplY3Q+IHtcclxuICAgIHRoaXMuc2V0RGVmYXVsdHMob3B0aW9ucyk7XHJcblxyXG4gICAgY29uc3QgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgZm9ybS5hcHBlbmQob3B0aW9ucy5maWVsZE5hbWUsIGZpbGUsIGZpbGUubmFtZSk7XHJcblxyXG4gICAgaWYgKGNyb3BPcHRpb25zKSB7XHJcbiAgICAgIGZvcm0uYXBwZW5kKCdYJywgY3JvcE9wdGlvbnMueC50b1N0cmluZygpKTtcclxuICAgICAgZm9ybS5hcHBlbmQoJ1knLCBjcm9wT3B0aW9ucy55LnRvU3RyaW5nKCkpO1xyXG4gICAgICBmb3JtLmFwcGVuZCgnV2lkdGgnLCBjcm9wT3B0aW9ucy53aWR0aC50b1N0cmluZygpKTtcclxuICAgICAgZm9ybS5hcHBlbmQoJ0hlaWdodCcsIGNyb3BPcHRpb25zLmhlaWdodC50b1N0cmluZygpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGxvYWQgZmlsZSBhbmQgcmVwb3J0IHByb2dyZXNzXHJcbiAgICBjb25zdCByZXEgPSBuZXcgSHR0cFJlcXVlc3QoJ1BPU1QnLCBvcHRpb25zLnVwbG9hZFVybCwgZm9ybSwge1xyXG4gICAgICByZXBvcnRQcm9ncmVzczogdHJ1ZSxcclxuICAgICAgd2l0aENyZWRlbnRpYWxzOiBvcHRpb25zLndpdGhDcmVkZW50aWFscyxcclxuICAgICAgaGVhZGVyczogdGhpcy5fYnVpbGRIZWFkZXJzKG9wdGlvbnMpXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jcmVhdGUob2JzID0+IHtcclxuICAgICAgY29uc3QgcXVldWVPYmogPSBuZXcgRmlsZVF1ZXVlT2JqZWN0KGZpbGUpO1xyXG5cclxuICAgICAgcXVldWVPYmoucmVxdWVzdCA9IHRoaXMuaHR0cC5yZXF1ZXN0KHJlcSkuc3Vic2NyaWJlKFxyXG4gICAgICAgIChldmVudDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gSHR0cEV2ZW50VHlwZS5VcGxvYWRQcm9ncmVzcykge1xyXG4gICAgICAgICAgICB0aGlzLl91cGxvYWRQcm9ncmVzcyhxdWV1ZU9iaiwgZXZlbnQpO1xyXG4gICAgICAgICAgICBvYnMubmV4dChxdWV1ZU9iaik7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgSHR0cFJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwbG9hZENvbXBsZXRlKHF1ZXVlT2JqLCBldmVudCk7XHJcbiAgICAgICAgICAgIG9icy5uZXh0KHF1ZXVlT2JqKTtcclxuICAgICAgICAgICAgb2JzLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAoZXJyOiBIdHRwRXJyb3JSZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVyci5lcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgICAgIC8vIEEgY2xpZW50LXNpZGUgb3IgbmV0d29yayBlcnJvciBvY2N1cnJlZC4gSGFuZGxlIGl0IGFjY29yZGluZ2x5LlxyXG4gICAgICAgICAgICB0aGlzLl91cGxvYWRGYWlsZWQocXVldWVPYmosIGVycik7XHJcbiAgICAgICAgICAgIG9icy5uZXh0KHF1ZXVlT2JqKTtcclxuICAgICAgICAgICAgb2JzLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUaGUgYmFja2VuZCByZXR1cm5lZCBhbiB1bnN1Y2Nlc3NmdWwgcmVzcG9uc2UgY29kZS5cclxuICAgICAgICAgICAgdGhpcy5fdXBsb2FkRmFpbGVkKHF1ZXVlT2JqLCBlcnIpO1xyXG4gICAgICAgICAgICBvYnMubmV4dChxdWV1ZU9iaik7XHJcbiAgICAgICAgICAgIG9icy5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0RmlsZSh1cmw6IHN0cmluZywgb3B0aW9uczogeyBhdXRoVG9rZW4/OiBzdHJpbmcsIGF1dGhUb2tlblByZWZpeD86IHN0cmluZyB9KTogT2JzZXJ2YWJsZTxGaWxlPiB7XHJcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jcmVhdGUoKG9ic2VydmVyOiBPYnNlcnZlcjxGaWxlPikgPT4ge1xyXG4gICAgICBsZXQgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuYXV0aFRva2VuKSB7XHJcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuYXBwZW5kKCdBdXRob3JpemF0aW9uJywgYCR7b3B0aW9ucy5hdXRoVG9rZW5QcmVmaXh9ICR7b3B0aW9ucy5hdXRoVG9rZW59YCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaHR0cC5nZXQodXJsLCB7IHJlc3BvbnNlVHlwZTogJ2Jsb2InLCBoZWFkZXJzOiBoZWFkZXJzfSkuc3Vic2NyaWJlKHJlcyA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IG5ldyBGaWxlKFtyZXNdLCAnZmlsZW5hbWUnLCB7IHR5cGU6IHJlcy50eXBlIH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm5leHQoZmlsZSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfSwgZXJyID0+IHtcclxuICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIuc3RhdHVzKTtcclxuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfYnVpbGRIZWFkZXJzKG9wdGlvbnM6IEZpbGVVcGxvYWRlck9wdGlvbnMpOiBIdHRwSGVhZGVycyB7XHJcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmF1dGhUb2tlbikge1xyXG4gICAgICBoZWFkZXJzID0gaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCBgJHtvcHRpb25zLmF1dGhUb2tlblByZWZpeH0gJHtvcHRpb25zLmF1dGhUb2tlbn1gKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy5jdXN0b21IZWFkZXJzKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMuY3VzdG9tSGVhZGVycykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuYXBwZW5kKGtleSwgb3B0aW9ucy5jdXN0b21IZWFkZXJzW2tleV0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaGVhZGVycztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3VwbG9hZFByb2dyZXNzKHF1ZXVlT2JqOiBGaWxlUXVldWVPYmplY3QsIGV2ZW50OiBhbnkpIHtcclxuICAgIC8vIHVwZGF0ZSB0aGUgRmlsZVF1ZXVlT2JqZWN0IHdpdGggdGhlIGN1cnJlbnQgcHJvZ3Jlc3NcclxuICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5yb3VuZCgxMDAgKiBldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCk7XHJcbiAgICBxdWV1ZU9iai5wcm9ncmVzcyA9IHByb2dyZXNzO1xyXG4gICAgcXVldWVPYmouc3RhdHVzID0gRmlsZVF1ZXVlU3RhdHVzLlByb2dyZXNzO1xyXG4gICAgLy8gdGhpcy5fcXVldWUubmV4dCh0aGlzLl9maWxlcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF91cGxvYWRDb21wbGV0ZShxdWV1ZU9iajogRmlsZVF1ZXVlT2JqZWN0LCByZXNwb25zZTogSHR0cFJlc3BvbnNlPGFueT4pIHtcclxuICAgIC8vIHVwZGF0ZSB0aGUgRmlsZVF1ZXVlT2JqZWN0IGFzIGNvbXBsZXRlZFxyXG4gICAgcXVldWVPYmoucHJvZ3Jlc3MgPSAxMDA7XHJcbiAgICBxdWV1ZU9iai5zdGF0dXMgPSBGaWxlUXVldWVTdGF0dXMuU3VjY2VzcztcclxuICAgIHF1ZXVlT2JqLnJlc3BvbnNlID0gcmVzcG9uc2U7XHJcbiAgICAvLyB0aGlzLl9xdWV1ZS5uZXh0KHRoaXMuX2ZpbGVzKTtcclxuICAgIC8vIHRoaXMub25Db21wbGV0ZUl0ZW0ocXVldWVPYmosIHJlc3BvbnNlLmJvZHkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdXBsb2FkRmFpbGVkKHF1ZXVlT2JqOiBGaWxlUXVldWVPYmplY3QsIHJlc3BvbnNlOiBIdHRwRXJyb3JSZXNwb25zZSkge1xyXG4gICAgLy8gdXBkYXRlIHRoZSBGaWxlUXVldWVPYmplY3QgYXMgZXJyb3JlZFxyXG4gICAgcXVldWVPYmoucHJvZ3Jlc3MgPSAwO1xyXG4gICAgcXVldWVPYmouc3RhdHVzID0gRmlsZVF1ZXVlU3RhdHVzLkVycm9yO1xyXG4gICAgcXVldWVPYmoucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgIC8vIHRoaXMuX3F1ZXVlLm5leHQodGhpcy5fZmlsZXMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXREZWZhdWx0cyhvcHRpb25zOiBGaWxlVXBsb2FkZXJPcHRpb25zKSB7XHJcbiAgICBvcHRpb25zLndpdGhDcmVkZW50aWFscyA9IG9wdGlvbnMud2l0aENyZWRlbnRpYWxzIHx8IGZhbHNlO1xyXG4gICAgb3B0aW9ucy5odHRwTWV0aG9kID0gb3B0aW9ucy5odHRwTWV0aG9kIHx8ICdQT1NUJztcclxuICAgIG9wdGlvbnMuYXV0aFRva2VuUHJlZml4ID0gb3B0aW9ucy5hdXRoVG9rZW5QcmVmaXggfHwgJ0JlYXJlcic7XHJcbiAgICBvcHRpb25zLmZpZWxkTmFtZSA9IG9wdGlvbnMuZmllbGROYW1lIHx8ICdmaWxlJztcclxuICB9XHJcbn1cclxuIl19