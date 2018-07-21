import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FileQueueObject } from './file-queue-object';
import { FileUploaderOptions, CropOptions } from './interfaces';
export declare class ImageUploaderService {
    private http;
    constructor(http: HttpClient);
    uploadFile(file: File, options: FileUploaderOptions, cropOptions?: CropOptions): Observable<FileQueueObject>;
    getFile(url: string, options: {
        authToken?: string;
        authTokenPrefix?: string;
    }): Observable<File>;
    private _buildHeaders(options);
    private _uploadProgress(queueObj, event);
    private _uploadComplete(queueObj, response);
    private _uploadFailed(queueObj, response);
    private setDefaults(options);
}
