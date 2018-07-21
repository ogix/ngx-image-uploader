import { OnInit, OnDestroy, AfterViewChecked, ElementRef, Renderer, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import Cropper from 'cropperjs';
import { ImageUploaderService } from './image-uploader.service';
import { ImageUploaderOptions } from './interfaces';
import { FileQueueObject } from './file-queue-object';
export declare enum Status {
    NotSelected = 0,
    Selected = 1,
    Uploading = 2,
    Loading = 3,
    Loaded = 4,
    Error = 5,
}
export declare class ImageUploaderComponent implements OnInit, OnDestroy, AfterViewChecked, ControlValueAccessor {
    private renderer;
    private uploader;
    private changeDetector;
    statusEnum: typeof Status;
    _status: Status;
    thumbnailWidth: number;
    thumbnailHeight: number;
    _imageThumbnail: any;
    _errorMessage: string;
    progress: number;
    origImageWidth: number;
    orgiImageHeight: number;
    cropper: Cropper;
    fileToUpload: File;
    imageElement: ElementRef;
    fileInputElement: ElementRef;
    dragOverlayElement: ElementRef;
    options: ImageUploaderOptions;
    upload: EventEmitter<FileQueueObject>;
    statusChange: EventEmitter<Status>;
    propagateChange: (_: any) => void;
    constructor(renderer: Renderer, uploader: ImageUploaderService, changeDetector: ChangeDetectorRef);
    imageThumbnail: any;
    errorMessage: string;
    status: Status;
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(): void;
    ngOnInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    loadAndResize(url: string): void;
    onImageClicked(): void;
    onFileChanged(): void;
    validateAndUpload(file: File): void;
    uploadImage(): void;
    removeImage(): void;
    dismissError(): void;
    drop(e: DragEvent): void;
    dragenter(e: DragEvent): void;
    dragover(e: DragEvent): void;
    dragleave(e: DragEvent): void;
    private updateDragOverlayStyles(isDragOver);
    private resize(result);
    private getType(dataUrl);
    private fileToDataURL(file, result);
}
