/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} url
 * @param {?} cb
 * @return {?}
 */
export function createImage(url, cb) {
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
export function resizeImage(origImage, { resizeHeight, resizeWidth, resizeQuality = 0.7, resizeType = 'image/jpeg', resizeMode = 'fill' } = {}) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvIiwic291cmNlcyI6WyJsaWIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUEsTUFBTSxzQkFBc0IsR0FBVyxFQUFFLEVBQWlDO0lBQ3hFLHVCQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQzFCLEtBQUssQ0FBQyxNQUFNLEdBQUc7UUFDYixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDWCxDQUFDO0lBQ0YsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Q0FDakI7QUFFRCx1QkFBTSxZQUFZLEdBQUcseUJBQXlCLENBQUM7Ozs7QUFFL0M7SUFDRSxxQkFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDaEIsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxZQUFZLENBQUM7UUFDN0IsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQsTUFBTSxtQkFBb0IsVUFBVSxFQUFDO0NBQ3RDOzs7Ozs7QUFFRCxNQUFNLHNCQUFzQixTQUEyQixFQUFFLEVBQ3ZELFlBQVksRUFDWixXQUFXLEVBQ1gsYUFBYSxHQUFHLEdBQUcsRUFDbkIsVUFBVSxHQUFHLFlBQVksRUFDekIsVUFBVSxHQUFHLE1BQU0sS0FDRixFQUFFO0lBRW5CLHVCQUFNLE1BQU0sR0FBRyxhQUFhLEVBQUUsQ0FBQztJQUUvQixxQkFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUM5QixxQkFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztJQUM1QixxQkFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLHFCQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFaEIsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7O1FBRTFCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsV0FBVyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDaEQsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxZQUFZLENBQUMsQ0FBQztTQUN6RDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBRyxXQUFXLENBQUMsQ0FBQztTQUN6RDtRQUVELE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBVyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDMUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUUvRCxPQUFPLEdBQUcsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUMxQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQzs7UUFHNUMsdUJBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDOUY7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7O1FBRTlCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUNuRCxLQUFLLEdBQUcsV0FBVyxDQUFDO2FBQ3ZCO1NBQ0o7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLEdBQUcsWUFBWSxDQUFDO2FBQ3pCO1NBQ0o7UUFFRCxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7UUFHdkIsdUJBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDakQ7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLEdBQUcsVUFBVSxDQUFDLENBQUM7S0FDdEQ7O0lBR0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0NBQ3BEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSZXNpemVPcHRpb25zfSBmcm9tICcuL2ludGVyZmFjZXMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltYWdlKHVybDogc3RyaW5nLCBjYjogKGk6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHZvaWQpIHtcclxuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGNiKGltYWdlKTtcclxuICB9O1xyXG4gIGltYWdlLnNyYyA9IHVybDtcclxufVxyXG5cclxuY29uc3QgcmVzaXplQXJlYUlkID0gJ2ltYWdldXBsb2FkLXJlc2l6ZS1hcmVhJztcclxuXHJcbmZ1bmN0aW9uIGdldFJlc2l6ZUFyZWEoKSB7XHJcbiAgbGV0IHJlc2l6ZUFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyZXNpemVBcmVhSWQpO1xyXG4gIGlmICghcmVzaXplQXJlYSkge1xyXG4gICAgcmVzaXplQXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgcmVzaXplQXJlYS5pZCA9IHJlc2l6ZUFyZWFJZDtcclxuICAgIHJlc2l6ZUFyZWEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVzaXplQXJlYSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gPEhUTUxDYW52YXNFbGVtZW50PnJlc2l6ZUFyZWE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemVJbWFnZShvcmlnSW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQsIHtcclxuICByZXNpemVIZWlnaHQsXHJcbiAgcmVzaXplV2lkdGgsXHJcbiAgcmVzaXplUXVhbGl0eSA9IDAuNyxcclxuICByZXNpemVUeXBlID0gJ2ltYWdlL2pwZWcnLFxyXG4gIHJlc2l6ZU1vZGUgPSAnZmlsbCdcclxufTogUmVzaXplT3B0aW9ucyA9IHt9KSB7XHJcblxyXG4gIGNvbnN0IGNhbnZhcyA9IGdldFJlc2l6ZUFyZWEoKTtcclxuXHJcbiAgbGV0IGhlaWdodCA9IG9yaWdJbWFnZS5oZWlnaHQ7XHJcbiAgbGV0IHdpZHRoID0gb3JpZ0ltYWdlLndpZHRoO1xyXG4gIGxldCBvZmZzZXRYID0gMDtcclxuICBsZXQgb2Zmc2V0WSA9IDA7XHJcblxyXG4gIGlmIChyZXNpemVNb2RlID09PSAnZmlsbCcpIHtcclxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgd2lkdGggYW5kIGhlaWdodCwgY29uc3RyYWluaW5nIHRoZSBwcm9wb3J0aW9uc1xyXG4gICAgaWYgKHdpZHRoIC8gaGVpZ2h0ID4gcmVzaXplV2lkdGggLyByZXNpemVIZWlnaHQpIHtcclxuICAgICAgd2lkdGggPSBNYXRoLnJvdW5kKGhlaWdodCAqIHJlc2l6ZVdpZHRoIC8gcmVzaXplSGVpZ2h0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhlaWdodCA9IE1hdGgucm91bmQod2lkdGggKiByZXNpemVIZWlnaHQgLyByZXNpemVXaWR0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FudmFzLndpZHRoID0gcmVzaXplV2lkdGggPD0gd2lkdGggPyByZXNpemVXaWR0aCA6IHdpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHJlc2l6ZUhlaWdodCA8PSBoZWlnaHQgPyByZXNpemVIZWlnaHQgOiBoZWlnaHQ7XHJcblxyXG4gICAgb2Zmc2V0WCA9IG9yaWdJbWFnZS53aWR0aCAvIDIgLSB3aWR0aCAvIDI7XHJcbiAgICBvZmZzZXRZID0gb3JpZ0ltYWdlLmhlaWdodCAvIDIgLSBoZWlnaHQgLyAyO1xyXG5cclxuICAgIC8vIGRyYXcgaW1hZ2Ugb24gY2FudmFzXHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIGN0eC5kcmF3SW1hZ2Uob3JpZ0ltYWdlLCBvZmZzZXRYLCBvZmZzZXRZLCB3aWR0aCwgaGVpZ2h0LCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gIH0gZWxzZSBpZiAocmVzaXplTW9kZSA9PT0gJ2ZpdCcpIHtcclxuICAgICAgLy8gY2FsY3VsYXRlIHRoZSB3aWR0aCBhbmQgaGVpZ2h0LCBjb25zdHJhaW5pbmcgdGhlIHByb3BvcnRpb25zXHJcbiAgICAgIGlmICh3aWR0aCA+IGhlaWdodCkge1xyXG4gICAgICAgICAgaWYgKHdpZHRoID4gcmVzaXplV2lkdGgpIHtcclxuICAgICAgICAgICAgICBoZWlnaHQgPSBNYXRoLnJvdW5kKGhlaWdodCAqPSByZXNpemVXaWR0aCAvIHdpZHRoKTtcclxuICAgICAgICAgICAgICB3aWR0aCA9IHJlc2l6ZVdpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGhlaWdodCA+IHJlc2l6ZUhlaWdodCkge1xyXG4gICAgICAgICAgICAgIHdpZHRoID0gTWF0aC5yb3VuZCh3aWR0aCAqPSByZXNpemVIZWlnaHQgLyBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgIGhlaWdodCA9IHJlc2l6ZUhlaWdodDtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAvLyBkcmF3IGltYWdlIG9uIGNhbnZhc1xyXG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgY3R4LmRyYXdJbWFnZShvcmlnSW1hZ2UsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gcmVzaXplTW9kZTogJyArIHJlc2l6ZU1vZGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gZ2V0IHRoZSBkYXRhIGZyb20gY2FudmFzIGFzIDcwJSBqcGcgKG9yIHNwZWNpZmllZCB0eXBlKS5cclxuICByZXR1cm4gY2FudmFzLnRvRGF0YVVSTChyZXNpemVUeXBlLCByZXNpemVRdWFsaXR5KTtcclxufVxyXG5cclxuXHJcbiJdfQ==