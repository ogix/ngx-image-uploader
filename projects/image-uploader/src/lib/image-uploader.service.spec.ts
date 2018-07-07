import { TestBed, inject } from '@angular/core/testing';

import { ImageUploaderService } from './image-uploader.service';

describe('ImageUploaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageUploaderService]
    });
  });

  it('should be created', inject([ImageUploaderService], (service: ImageUploaderService) => {
    expect(service).toBeTruthy();
  }));
});
