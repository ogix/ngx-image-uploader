import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { FileQueueStatus } from './file-queue-status';
export declare class FileQueueObject {
    file: any;
    status: FileQueueStatus;
    progress: number;
    request: Subscription;
    response: HttpResponse<any> | HttpErrorResponse;
    constructor(file: any);
    isPending: () => boolean;
    isSuccess: () => boolean;
    isError: () => boolean;
    inProgress: () => boolean;
    isUploadable: () => boolean;
}
