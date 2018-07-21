/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { FileQueueStatus } from './file-queue-status';
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
export { FileQueueObject };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1xdWV1ZS1vYmplY3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvIiwic291cmNlcyI6WyJsaWIvZmlsZS1xdWV1ZS1vYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUdBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV0RCxJQUFBO0lBT0UseUJBQVksSUFBUztRQUFyQixpQkFFQztzQkFQZ0MsZUFBZSxDQUFDLE9BQU87d0JBQzlCLENBQUM7dUJBQ0ksSUFBSTt3QkFDc0IsSUFBSTt5QkFZMUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLE9BQU8sRUFBdkMsQ0FBdUM7eUJBQzdDLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxLQUFLLGVBQWUsQ0FBQyxPQUFPLEVBQXZDLENBQXVDO3VCQUMvQyxjQUFNLE9BQUEsS0FBSSxDQUFDLE1BQU0sS0FBSyxlQUFlLENBQUMsS0FBSyxFQUFyQyxDQUFxQzswQkFDeEMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLFFBQVEsRUFBeEMsQ0FBd0M7NEJBQzVDLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxLQUFLLGVBQWUsQ0FBQyxPQUFPLElBQUksS0FBSSxDQUFDLE1BQU0sS0FBSyxlQUFlLENBQUMsS0FBSyxFQUFoRixDQUFnRjtRQWIxRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNsQjswQkFkSDtJQTJCQyxDQUFBO0FBdEJELDJCQXNCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBSZXNwb25zZSwgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgRmlsZVF1ZXVlU3RhdHVzIH0gZnJvbSAnLi9maWxlLXF1ZXVlLXN0YXR1cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgRmlsZVF1ZXVlT2JqZWN0IHtcclxuICBwdWJsaWMgZmlsZTogYW55O1xyXG4gIHB1YmxpYyBzdGF0dXM6IEZpbGVRdWV1ZVN0YXR1cyA9IEZpbGVRdWV1ZVN0YXR1cy5QZW5kaW5nO1xyXG4gIHB1YmxpYyBwcm9ncmVzczogbnVtYmVyID0gMDtcclxuICBwdWJsaWMgcmVxdWVzdDogU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICBwdWJsaWMgcmVzcG9uc2U6IEh0dHBSZXNwb25zZTxhbnk+IHwgSHR0cEVycm9yUmVzcG9uc2UgPSBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihmaWxlOiBhbnkpIHtcclxuICAgIHRoaXMuZmlsZSA9IGZpbGU7XHJcbiAgfVxyXG5cclxuICAvLyBhY3Rpb25zXHJcbiAgLy8gcHVibGljIHVwbG9hZCA9ICgpID0+IHsgLyogc2V0IGluIHNlcnZpY2UgKi8gfTtcclxuICAvLyBwdWJsaWMgY2FuY2VsID0gKCkgPT4geyAvKiBzZXQgaW4gc2VydmljZSAqLyB9O1xyXG4gIC8vIHB1YmxpYyByZW1vdmUgPSAoKSA9PiB7IC8qIHNldCBpbiBzZXJ2aWNlICovIH07XHJcblxyXG4gIC8vIHN0YXR1c2VzXHJcbiAgcHVibGljIGlzUGVuZGluZyA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuUGVuZGluZztcclxuICBwdWJsaWMgaXNTdWNjZXNzID0gKCkgPT4gdGhpcy5zdGF0dXMgPT09IEZpbGVRdWV1ZVN0YXR1cy5TdWNjZXNzO1xyXG4gIHB1YmxpYyBpc0Vycm9yID0gKCkgPT4gdGhpcy5zdGF0dXMgPT09IEZpbGVRdWV1ZVN0YXR1cy5FcnJvcjtcclxuICBwdWJsaWMgaW5Qcm9ncmVzcyA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuUHJvZ3Jlc3M7XHJcbiAgcHVibGljIGlzVXBsb2FkYWJsZSA9ICgpID0+IHRoaXMuc3RhdHVzID09PSBGaWxlUXVldWVTdGF0dXMuUGVuZGluZyB8fCB0aGlzLnN0YXR1cyA9PT0gRmlsZVF1ZXVlU3RhdHVzLkVycm9yO1xyXG59XHJcbiJdfQ==