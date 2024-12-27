import { TestBed } from '@angular/core/testing';

import { ImageUtilsService } from './image-utils.service';

describe('ImageUtilsService', () => {
  let service: ImageUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleImageError', () => {
    it('should set placeholder image when image fails to load', () => {
      // Create a mock image element
      const mockImg = document.createElement('img');
      mockImg.src = 'invalid-image.jpg';

      // Create a proper Event mock
      const mockEvent = new Event('error');
      Object.defineProperty(mockEvent, 'target', { value: mockImg });

      // Call the handleImageError method
      service.handleImageError(mockEvent);

      // Verify that the image src was set to placeholder
      expect(mockImg.src).toContain('assets/images/placeholder.jpg');
    });

    it('should handle null event target gracefully', () => {
      // Create a proper Event mock with null target
      const mockEvent = new Event('error');
      Object.defineProperty(mockEvent, 'target', { value: null });

      // Verify that calling the method with null target doesn't throw error
      expect(() => {
        service.handleImageError(mockEvent);
      }).not.toThrow();
    });

    it('should handle non-image event target gracefully', () => {
      // Create a proper Event mock with non-image element
      const mockEvent = new Event('error');
      Object.defineProperty(mockEvent, 'target', { value: document.createElement('div') });

      // Verify that calling the method with non-image target doesn't throw error
      expect(() => {
        service.handleImageError(mockEvent);
      }).not.toThrow();
    });
  });
});
