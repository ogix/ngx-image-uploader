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
export function resizeImage(origImage, _a) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtaW1hZ2UtdXBsb2FkZXIvIiwic291cmNlcyI6WyJsaWIvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUEsTUFBTSxzQkFBc0IsR0FBVyxFQUFFLEVBQWlDO0lBQ3hFLHFCQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQzFCLEtBQUssQ0FBQyxNQUFNLEdBQUc7UUFDYixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDWCxDQUFDO0lBQ0YsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Q0FDakI7QUFFRCxxQkFBTSxZQUFZLEdBQUcseUJBQXlCLENBQUM7Ozs7QUFFL0M7SUFDRSxxQkFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDaEIsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxZQUFZLENBQUM7UUFDN0IsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQsTUFBTSxtQkFBb0IsVUFBVSxFQUFDO0NBQ3RDOzs7Ozs7QUFFRCxNQUFNLHNCQUFzQixTQUEyQixFQUFFLEVBTXBDO1FBTm9DLDRCQU1wQyxFQUxuQiw4QkFBWSxFQUNaLDRCQUFXLEVBQ1gscUJBQW1CLEVBQW5CLHdDQUFtQixFQUNuQixrQkFBeUIsRUFBekIsOENBQXlCLEVBQ3pCLGtCQUFtQixFQUFuQix3Q0FBbUI7SUFHbkIscUJBQU0sTUFBTSxHQUFHLGFBQWEsRUFBRSxDQUFDO0lBRS9CLHFCQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMs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blxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1hZ2UodXJsOiBzdHJpbmcsIGNiOiAoaTogSFRNTEltYWdlRWxlbWVudCkgPT4gdm9pZCkge1xyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY2IoaW1hZ2UpO1xyXG4gIH07XHJcbiAgaW1hZ2Uuc3JjID0gdXJsO1xyXG59XHJcblxyXG5jb25zdCByZXNpemVBcmVhSWQgPSAnaW1hZ2V1cGxvYWQtcmVzaXplLWFyZWEnO1xyXG5cclxuZnVuY3Rpb24gZ2V0UmVzaXplQXJlYSgpIHtcclxuICBsZXQgcmVzaXplQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJlc2l6ZUFyZWFJZCk7XHJcbiAgaWYgKCFyZXNpemVBcmVhKSB7XHJcbiAgICByZXNpemVBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICByZXNpemVBcmVhLmlkID0gcmVzaXplQXJlYUlkO1xyXG4gICAgcmVzaXplQXJlYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZXNpemVBcmVhKTtcclxuICB9XHJcblxyXG4gIHJldHVybiA8SFRNTENhbnZhc0VsZW1lbnQ+cmVzaXplQXJlYTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZUltYWdlKG9yaWdJbWFnZTogSFRNTEltYWdlRWxlbWVudCwge1xyXG4gIHJlc2l6ZUhlaWdodCxcclxuICByZXNpemVXaWR0aCxcclxuICByZXNpemVRdWFsaXR5ID0gMC43LFxyXG4gIHJlc2l6ZVR5cGUgPSAnaW1hZ2UvanBlZycsXHJcbiAgcmVzaXplTW9kZSA9ICdmaWxsJ1xyXG59OiBSZXNpemVPcHRpb25zID0ge30pIHtcclxuXHJcbiAgY29uc3QgY2FudmFzID0gZ2V0UmVzaXplQXJlYSgpO1xyXG5cclxuICBsZXQgaGVpZ2h0ID0gb3JpZ0ltYWdlLmhlaWdodDtcclxuICBsZXQgd2lkdGggPSBvcmlnSW1hZ2Uud2lkdGg7XHJcbiAgbGV0IG9mZnNldFggPSAwO1xyXG4gIGxldCBvZmZzZXRZID0gMDtcclxuXHJcbiAgaWYgKHJlc2l6ZU1vZGUgPT09ICdmaWxsJykge1xyXG4gICAgLy8gY2FsY3VsYXRlIHRoZSB3aWR0aCBhbmQgaGVpZ2h0LCBjb25zdHJhaW5pbmcgdGhlIHByb3BvcnRpb25zXHJcbiAgICBpZiAod2lkdGggLyBoZWlnaHQgPiByZXNpemVXaWR0aCAvIHJlc2l6ZUhlaWdodCkge1xyXG4gICAgICB3aWR0aCA9IE1hdGgucm91bmQoaGVpZ2h0ICogcmVzaXplV2lkdGggLyByZXNpemVIZWlnaHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaGVpZ2h0ID0gTWF0aC5yb3VuZCh3aWR0aCAqIHJlc2l6ZUhlaWdodCAvIHJlc2l6ZVdpZHRoKTtcclxuICAgIH1cclxuXHJcbiAgICBjYW52YXMud2lkdGggPSByZXNpemVXaWR0aCA8PSB3aWR0aCA/IHJlc2l6ZVdpZHRoIDogd2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gcmVzaXplSGVpZ2h0IDw9IGhlaWdodCA/IHJlc2l6ZUhlaWdodCA6IGhlaWdodDtcclxuXHJcbiAgICBvZmZzZXRYID0gb3JpZ0ltYWdlLndpZHRoIC8gMiAtIHdpZHRoIC8gMjtcclxuICAgIG9mZnNldFkgPSBvcmlnSW1hZ2UuaGVpZ2h0IC8gMiAtIGhlaWdodCAvIDI7XHJcblxyXG4gICAgLy8gZHJhdyBpbWFnZSBvbiBjYW52YXNcclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgY3R4LmRyYXdJbWFnZShvcmlnSW1hZ2UsIG9mZnNldFgsIG9mZnNldFksIHdpZHRoLCBoZWlnaHQsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgfSBlbHNlIGlmIChyZXNpemVNb2RlID09PSAnZml0Jykge1xyXG4gICAgICAvLyBjYWxjdWxhdGUgdGhlIHdpZHRoIGFuZCBoZWlnaHQsIGNvbnN0cmFpbmluZyB0aGUgcHJvcG9ydGlvbnNcclxuICAgICAgaWYgKHdpZHRoID4gaGVpZ2h0KSB7XHJcbiAgICAgICAgICBpZiAod2lkdGggPiByZXNpemVXaWR0aCkge1xyXG4gICAgICAgICAgICAgIGhlaWdodCA9IE1hdGgucm91bmQoaGVpZ2h0ICo9IHJlc2l6ZVdpZHRoIC8gd2lkdGgpO1xyXG4gICAgICAgICAgICAgIHdpZHRoID0gcmVzaXplV2lkdGg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoaGVpZ2h0ID4gcmVzaXplSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgd2lkdGggPSBNYXRoLnJvdW5kKHdpZHRoICo9IHJlc2l6ZUhlaWdodCAvIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgaGVpZ2h0ID0gcmVzaXplSGVpZ2h0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgIC8vIGRyYXcgaW1hZ2Ugb24gY2FudmFzXHJcbiAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICBjdHguZHJhd0ltYWdlKG9yaWdJbWFnZSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biByZXNpemVNb2RlOiAnICsgcmVzaXplTW9kZSk7XHJcbiAgfVxyXG5cclxuICAvLyBnZXQgdGhlIGRhdGEgZnJvbSBjYW52YXMgYXMgNzAlIGpwZyAob3Igc3BlY2lmaWVkIHR5cGUpLlxyXG4gIHJldHVybiBjYW52YXMudG9EYXRhVVJMKHJlc2l6ZVR5cGUsIHJlc2l6ZVF1YWxpdHkpO1xyXG59XHJcblxyXG5cclxuIl19