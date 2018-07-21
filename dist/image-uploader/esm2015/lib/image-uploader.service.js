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
export class ImageUploaderService {
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
/** @nocollapse */ ImageUploaderService.ngInjectableDef = i0.defineInjectable({ factory: function ImageUploaderService_Factory() { return new ImageUploaderService(i0.inject(i1.HttpClient)); }, token: ImageUploaderService, providedIn: "root" });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtdXBsb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1pbWFnZS11cGxvYWRlci8iLCJzb3VyY2VzIjpbImxpYi9pbWFnZS11cGxvYWRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQVksVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBcUIsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFNUgsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7O0FBTXRELE1BQU07Ozs7SUFFSixZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0tBQUk7Ozs7Ozs7SUFFeEMsVUFBVSxDQUFDLElBQVUsRUFBRSxPQUE0QixFQUFFLFdBQXlCO1FBQzVFLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUIsdUJBQU0sSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFaEQsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxNQUFN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LENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUM3QixRQUFRLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUM7Ozs7Ozs7O0lBSXJDLGVBQWUsQ0FBQyxRQUF5QixFQUFFLFFBQTJCOztRQUU1RSxRQUFRLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUN4QixRQUFRLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFDMUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Ozs7Ozs7OztJQUt2QixhQUFhLENBQUMsUUFBeUIsRUFBRSxRQUEyQjs7UUFFMUUsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDdEIsUUFBUSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO1FBQ3hDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOzs7Ozs7O0lBSXZCLFdBQVcsQ0FBQyxPQUE0QjtRQUM5QyxPQUFPLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLElBQUksS0FBSyxDQUFDO1FBQzNELE9BQU8sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUM7UUFDbEQsT0FBTyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxJQUFJLFFBQVEsQ0FBQztRQUM5RCxPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDOzs7O1lBMUhuRCxVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFSUSxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2ZXIsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUmVxdWVzdCwgSHR0cEV2ZW50VHlwZSwgSHR0cFJlc3BvbnNlLCBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcblxyXG5pbXBvcnQgeyBGaWxlUXVldWVPYmplY3QgfSBmcm9tICcuL2ZpbGUtcXVldWUtb2JqZWN0JztcclxuaW1wb3J0IHsgRmlsZVF1ZXVlU3RhdHVzIH0gZnJvbSAnLi9maWxlLXF1ZXVlLXN0YXR1cyc7XHJcbmltcG9ydCB7IEZpbGVVcGxvYWRlck9wdGlvbnMsIENyb3BPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlVXBsb2FkZXJTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7fVxyXG5cclxuICB1cGxvYWRGaWxlKGZpbGU6IEZpbGUsIG9wdGlvbnM6IEZpbGVVcGxvYWRlck9wdGlvbnMsIGNyb3BPcHRpb25zPzogQ3JvcE9wdGlvbnMpOiBPYnNlcnZhYmxlPEZpbGVRdWV1ZU9iamVjdD4ge1xyXG4gICAgdGhpcy5zZXREZWZhdWx0cyhvcHRpb25zKTtcclxuXHJcbiAgICBjb25zdCBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICBmb3JtLmFwcGVuZChvcHRpb25zLmZpZWxkTmFtZSwgZmlsZSwgZmlsZS5uYW1lKTtcclxuXHJcbiAgICBpZiAoY3JvcE9wdGlvbnMpIHtcclxuICAgICAgZm9ybS5hcHBlbmQoJ1gnLCBjcm9wT3B0aW9ucy54LnRvU3RyaW5nKCkpO1xyXG4gICAgICBmb3JtLmFwcGVuZCgnWScsIGNyb3BPcHRpb25zLnkudG9TdHJpbmcoKSk7XHJcbiAgICAgIGZvcm0uYXBwZW5kKCdXaWR0aCcsIGNyb3BPcHRpb25zLndpZHRoLnRvU3RyaW5nKCkpO1xyXG4gICAgICBmb3JtLmFwcGVuZCgnSGVpZ2h0JywgY3JvcE9wdGlvbnMuaGVpZ2h0LnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwbG9hZCBmaWxlIGFuZCByZXBvcnQgcHJvZ3Jlc3NcclxuICAgIGNvbnN0IHJlcSA9IG5ldyBIdHRwUmVxdWVzdCgnUE9TVCcsIG9wdGlvbnMudXBsb2FkVXJsLCBmb3JtLCB7XHJcbiAgICAgIHJlcG9ydFByb2dyZXNzOiB0cnVlLFxyXG4gICAgICB3aXRoQ3JlZGVudGlhbHM6IG9wdGlvbnMud2l0aENyZWRlbnRpYWxzLFxyXG4gICAgICBoZWFkZXJzOiB0aGlzLl9idWlsZEhlYWRlcnMob3B0aW9ucylcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShvYnMgPT4ge1xyXG4gICAgICBjb25zdCBxdWV1ZU9iaiA9IG5ldyBGaWxlUXVldWVPYmplY3QoZmlsZSk7XHJcblxyXG4gICAgICBxdWV1ZU9iai5yZXF1ZXN0ID0gdGhpcy5odHRwLnJlcXVlc3QocmVxKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGV2ZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChldmVudC50eXBlID09PSBIdHRwRXZlbnRUeXBlLlVwbG9hZFByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwbG9hZFByb2dyZXNzKHF1ZXVlT2JqLCBldmVudCk7XHJcbiAgICAgICAgICAgIG9icy5uZXh0KHF1ZXVlT2JqKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBIdHRwUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBsb2FkQ29tcGxldGUocXVldWVPYmosIGV2ZW50KTtcclxuICAgICAgICAgICAgb2JzLm5leHQocXVldWVPYmopO1xyXG4gICAgICAgICAgICBvYnMuY29tcGxldGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIChlcnI6IEh0dHBFcnJvclJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyLmVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgLy8gQSBjbGllbnQtc2lkZSBvciBuZXR3b3JrIGVycm9yIG9jY3VycmVkLiBIYW5kbGUgaXQgYWNjb3JkaW5nbHkuXHJcbiAgICAgICAgICAgIHRoaXMuX3VwbG9hZEZhaWxlZChxdWV1ZU9iaiwgZXJyKTtcclxuICAgICAgICAgICAgb2JzLm5leHQocXVldWVPYmopO1xyXG4gICAgICAgICAgICBvYnMuY29tcGxldGUoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRoZSBiYWNrZW5kIHJldHVybmVkIGFuIHVuc3VjY2Vzc2Z1bCByZXNwb25zZSBjb2RlLlxyXG4gICAgICAgICAgICB0aGlzLl91cGxvYWRGYWlsZWQocXVldWVPYmosIGVycik7XHJcbiAgICAgICAgICAgIG9icy5uZXh0KHF1ZXVlT2JqKTtcclxuICAgICAgICAgICAgb2JzLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRGaWxlKHVybDogc3RyaW5nLCBvcHRpb25zOiB7IGF1dGhUb2tlbj86IHN0cmluZywgYXV0aFRva2VuUHJlZml4Pzogc3RyaW5nIH0pOiBPYnNlcnZhYmxlPEZpbGU+IHtcclxuICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZSgob2JzZXJ2ZXI6IE9ic2VydmVyPEZpbGU+KSA9PiB7XHJcbiAgICAgIGxldCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5hdXRoVG9rZW4pIHtcclxuICAgICAgICBoZWFkZXJzID0gaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCBgJHtvcHRpb25zLmF1dGhUb2tlblByZWZpeH0gJHtvcHRpb25zLmF1dGhUb2tlbn1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5odHRwLmdldCh1cmwsIHsgcmVzcG9uc2VUeXBlOiAnYmxvYicsIGhlYWRlcnM6IGhlYWRlcnN9KS5zdWJzY3JpYmUocmVzID0+IHtcclxuICAgICAgICBjb25zdCBmaWxlID0gbmV3IEZpbGUoW3Jlc10sICdmaWxlbmFtZScsIHsgdHlwZTogcmVzLnR5cGUgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChmaWxlKTtcclxuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xyXG4gICAgICB9LCBlcnIgPT4ge1xyXG4gICAgICAgIG9ic2VydmVyLmVycm9yKGVyci5zdGF0dXMpO1xyXG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9idWlsZEhlYWRlcnMob3B0aW9uczogRmlsZVVwbG9hZGVyT3B0aW9ucyk6IEh0dHBIZWFkZXJzIHtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuYXV0aFRva2VuKSB7XHJcbiAgICAgIGhlYWRlcnMgPSBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsIGAke29wdGlvbnMuYXV0aFRva2VuUHJlZml4fSAke29wdGlvbnMuYXV0aFRva2VufWApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmN1c3RvbUhlYWRlcnMpIHtcclxuICAgICAgT2JqZWN0LmtleXMob3B0aW9ucy5jdXN0b21IZWFkZXJzKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICBoZWFkZXJzID0gaGVhZGVycy5hcHBlbmQoa2V5LCBvcHRpb25zLmN1c3RvbUhlYWRlcnNba2V5XSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoZWFkZXJzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdXBsb2FkUHJvZ3Jlc3MocXVldWVPYmo6IEZpbGVRdWV1ZU9iamVjdCwgZXZlbnQ6IGFueSkge1xyXG4gICAgLy8gdXBkYXRlIHRoZSBGaWxlUXVldWVPYmplY3Qgd2l0aCB0aGUgY3VycmVudCBwcm9ncmVzc1xyXG4gICAgY29uc3QgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKDEwMCAqIGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsKTtcclxuICAgIHF1ZXVlT2JqLnByb2dyZXNzID0gcHJvZ3Jlc3M7XHJcbiAgICBxdWV1ZU9iai5zdGF0dXMgPSBGaWxlUXVldWVTdGF0dXMuUHJvZ3Jlc3M7XHJcbiAgICAvLyB0aGlzLl9xdWV1ZS5uZXh0KHRoaXMuX2ZpbGVzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3VwbG9hZENvbXBsZXRlKHF1ZXVlT2JqOiBGaWxlUXVldWVPYmplY3QsIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55Pikge1xyXG4gICAgLy8gdXBkYXRlIHRoZSBGaWxlUXVldWVPYmplY3QgYXMgY29tcGxldGVkXHJcbiAgICBxdWV1ZU9iai5wcm9ncmVzcyA9IDEwMDtcclxuICAgIHF1ZXVlT2JqLnN0YXR1cyA9IEZpbGVRdWV1ZVN0YXR1cy5TdWNjZXNzO1xyXG4gICAgcXVldWVPYmoucmVzcG9uc2UgPSByZXNwb25zZTtcclxuICAgIC8vIHRoaXMuX3F1ZXVlLm5leHQodGhpcy5fZmlsZXMpO1xyXG4gICAgLy8gdGhpcy5vbkNvbXBsZXRlSXRlbShxdWV1ZU9iaiwgcmVzcG9uc2UuYm9keSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF91cGxvYWRGYWlsZWQocXVldWVPYmo6IEZpbGVRdWV1ZU9iamVjdCwgcmVzcG9uc2U6IEh0dHBFcnJvclJlc3BvbnNlKSB7XHJcbiAgICAvLyB1cGRhdGUgdGhlIEZpbGVRdWV1ZU9iamVjdCBhcyBlcnJvcmVkXHJcbiAgICBxdWV1ZU9iai5wcm9ncmVzcyA9IDA7XHJcbiAgICBxdWV1ZU9iai5zdGF0dXMgPSBGaWxlUXVldWVTdGF0dXMuRXJyb3I7XHJcbiAgICBxdWV1ZU9iai5yZXNwb25zZSA9IHJlc3BvbnNlO1xyXG4gICAgLy8gdGhpcy5fcXVldWUubmV4dCh0aGlzLl9maWxlcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldERlZmF1bHRzKG9wdGlvbnM6IEZpbGVVcGxvYWRlck9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgfHwgZmFsc2U7XHJcbiAgICBvcHRpb25zLmh0dHBNZXRob2QgPSBvcHRpb25zLmh0dHBNZXRob2QgfHwgJ1BPU1QnO1xyXG4gICAgb3B0aW9ucy5hdXRoVG9rZW5QcmVmaXggPSBvcHRpb25zLmF1dGhUb2tlblByZWZpeCB8fCAnQmVhcmVyJztcclxuICAgIG9wdGlvbnMuZmllbGROYW1lID0gb3B0aW9ucy5maWVsZE5hbWUgfHwgJ2ZpbGUnO1xyXG4gIH1cclxufVxyXG4iXX0=