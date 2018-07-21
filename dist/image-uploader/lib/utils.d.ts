import { ResizeOptions } from './interfaces';
export declare function createImage(url: string, cb: (i: HTMLImageElement) => void): void;
export declare function resizeImage(origImage: HTMLImageElement, {resizeHeight, resizeWidth, resizeQuality, resizeType, resizeMode}?: ResizeOptions): string;
