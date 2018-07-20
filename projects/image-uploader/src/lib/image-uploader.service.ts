import { Observer, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { FileQueueObject } from './file-queue-object';
import { FileQueueStatus } from './file-queue-status';
import { FileUploaderOptions, CropOptions } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ImageUploaderService {

  constructor(private http: HttpClient) {}

  uploadFile(file: File, options: FileUploaderOptions, cropOptions?: CropOptions): Observable<FileQueueObject> {
    this.setDefaults(options);

    const form = new FormData();
    form.append(options.fieldName, file, file.name);

    if (cropOptions) {
      form.append('X', cropOptions.x.toString());
      form.append('Y', cropOptions.y.toString());
      form.append('Width', cropOptions.width.toString());
      form.append('Height', cropOptions.height.toString());
    }

    // upload file and report progress
    const req = new HttpRequest('POST', options.uploadUrl, form, {
      reportProgress: true,
      withCredentials: options.withCredentials,
      headers: this._buildHeaders(options)
    });

    return Observable.create(obs => {
      const queueObj = new FileQueueObject(file);

      queueObj.request = this.http.request(req).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this._uploadProgress(queueObj, event);
            obs.next(queueObj);
          } else if (event instanceof HttpResponse) {
            this._uploadComplete(queueObj, event);
            obs.next(queueObj);
            obs.complete();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            this._uploadFailed(queueObj, err);
            obs.next(queueObj);
            obs.complete();
          } else {
            // The backend returned an unsuccessful response code.
            this._uploadFailed(queueObj, err);
            obs.next(queueObj);
            obs.complete();
          }
        }
      );
    });
  }

  getFile(url: string, options: { authToken?: string, authTokenPrefix?: string }): Observable<File> {
    return Observable.create((observer: Observer<File>) => {
      let headers = new HttpHeaders();

      if (options.authToken) {
        headers = headers.append('Authorization', `${options.authTokenPrefix} ${options.authToken}`);
      }

      this.http.get(url, { responseType: 'blob', headers: headers}).subscribe(res => {
        const file = new File([res], 'filename', { type: res.type });
        observer.next(file);
        observer.complete();
      }, err => {
        observer.error(err.status);
        observer.complete();
      });
    });
  }

  private _buildHeaders(options: FileUploaderOptions): HttpHeaders {
    let headers = new HttpHeaders();

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

  private _uploadProgress(queueObj: FileQueueObject, event: any) {
    // update the FileQueueObject with the current progress
    const progress = Math.round(100 * event.loaded / event.total);
    queueObj.progress = progress;
    queueObj.status = FileQueueStatus.Progress;
    // this._queue.next(this._files);
  }

  private _uploadComplete(queueObj: FileQueueObject, response: HttpResponse<any>) {
    // update the FileQueueObject as completed
    queueObj.progress = 100;
    queueObj.status = FileQueueStatus.Success;
    queueObj.response = response;
    // this._queue.next(this._files);
    // this.onCompleteItem(queueObj, response.body);
  }

  private _uploadFailed(queueObj: FileQueueObject, response: HttpErrorResponse) {
    // update the FileQueueObject as errored
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Error;
    queueObj.response = response;
    // this._queue.next(this._files);
  }

  private setDefaults(options: FileUploaderOptions) {
    options.withCredentials = options.withCredentials || false;
    options.httpMethod = options.httpMethod || 'POST';
    options.authTokenPrefix = options.authTokenPrefix || 'Bearer';
    options.fieldName = options.fieldName || 'file';
  }
}
