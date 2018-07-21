/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { FileQueueStatus } from './file-queue-status';
export class FileQueueObject {
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
function FileQueueObject_tsickle_Closure_declarations() {
    /** @type {?} */
    FileQueueObject.prototype.file;
    /** @type {?} */
    FileQueueObject.prototype.status;
    /** @type {?} */
    FileQueueObject.prototype.progress;
    /** @type {?} */
    FileQueueObject.prototype.request;
    /** @type {?} */
    FileQueueObject.prototype.response;
    /** @type {?} */
    FileQueueObject.prototype.isPending;
    /** @type {?} */
    FileQueueObject.prototype.isSuccess;
    /** @type {?} */
    FileQueueObject.prototype.isError;
    /** @type {?} */
    FileQueueObject.prototype.inProgress;
    /** @type {?} */
    FileQueueObject.prototype.isUploadable;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1xdWV1ZS1vYmplY3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvIiwic291cmNlcyI6WyJsaWIvZmlsZS1xdWV1ZS1vYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUdBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV0RCxNQUFNOzs7O0lBT0osWUFBWSxJQUFTO3NCQUxZLGVBQWUsQ0FBQyxPQUFPO3dCQUM5QixDQUFDO3VCQUNJLElBQUk7d0JBQ3NCLElBQUk7eUJBWTFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLE9BQU87eUJBQzdDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLE9BQU87dUJBQy9DLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLEtBQUs7MEJBQ3hDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLFFBQVE7NEJBQzVDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLGVBQWUsQ0FBQyxLQUFLO1FBYjFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCO0NBYUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwUmVzcG9uc2UsIEh0dHBFcnJvclJlc3BvbnNlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IEZpbGVRdWV1ZVN0YXR1cyB9IGZyb20gJy4vZmlsZS1xdWV1ZS1zdGF0dXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpbGVRdWV1ZU9iamVjdCB7XHJcbiAgcHVibGljIGZpbGU6IGFueTtcclxuICBwdWJsaWMgc3RhdHVzOiBGaWxlUXVldWVTdGF0dXMgPSBGaWxlUXVldWVTdGF0dXMuUGVuZGluZztcclxuICBwdWJsaWMgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XHJcbiAgcHVibGljIHJlcXVlc3Q6IFN1YnNjcmlwdGlvbiA9IG51bGw7XHJcbiAgcHVibGljIHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8YW55PiB8IEh0dHBFcnJvclJlc3BvbnNlID0gbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IoZmlsZTogYW55KSB7XHJcbiAgICB0aGlzLmZpbGUgPSBmaWxlO1xyXG4gIH1cclxuXHJcbiAgLy8gYWN0aW9uc1xyXG4gIC8vIHB1YmxpYyB1cGxvYWQgPSAoKSA9PiB7IC8qIHNldCBpbiBzZXJ2aWNlICovIH07XHJcbiAgLy8gcHVibGljIGNhbmNlbCA9ICgpID0+IHsgLyogc2V0IGluIHNlcnZpY2UgKi8gfTtcclxuICAvLyBwdWJsaWMgcmVtb3ZlID0gKCkgPT4geyAvKiBzZXQgaW4gc2VydmljZSAqLyB9O1xyXG5cclxuICAvLyBzdGF0dXNlc1xyXG4gIHB1YmxpYyBpc1BlbmRpbmcgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlBlbmRpbmc7XHJcbiAgcHVibGljIGlzU3VjY2VzcyA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuU3VjY2VzcztcclxuICBwdWJsaWMgaXNFcnJvciA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuRXJyb3I7XHJcbiAgcHVibGljIGluUHJvZ3Jlc3MgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlByb2dyZXNzO1xyXG4gIHB1YmxpYyBpc1VwbG9hZGFibGUgPSAoKSA9PiB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLlBlbmRpbmcgfHwgdGhpcy5zdGF0dXMgPT09IEZpbGVRdWV1ZVN0YXR1cy5FcnJvcjtcclxufVxyXG4iXX0=