import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PhotoDetailComponent } from './photo-detail.component';
import { ActivatedRoute } from '@angular/router';
import { PhotosService } from '../../../services/photos.service';
import { Location } from '@angular/common';
import { ImageUtilsService } from '../../../shared/services/image-utils.service';
import { of, throwError, delay } from 'rxjs';
import { Photo } from '../../../interfaces/photo.interface';

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let photosService: jasmine.SpyObj<PhotosService>;
  let location: jasmine.SpyObj<Location>;
  let imageUtils: jasmine.SpyObj<ImageUtilsService>;

  const mockPhoto: Photo = {
    id: 1,
    albumId: 1,
    title: 'Test Photo',
    url: 'test-url',
    thumbnailUrl: 'test-thumb-url'
  };

  beforeEach(async () => {
    const photosServiceSpy = jasmine.createSpyObj('PhotosService', ['getPhoto']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const imageUtilsSpy = jasmine.createSpyObj('ImageUtilsService', ['handleImageError']);
    
    // Mock ActivatedRoute with params observable
    const routeMock = {
      params: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [PhotoDetailComponent],
      providers: [
        { provide: PhotosService, useValue: photosServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ImageUtilsService, useValue: imageUtilsSpy },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    photosService = TestBed.inject(PhotosService) as jasmine.SpyObj<PhotosService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    imageUtils = TestBed.inject(ImageUtilsService) as jasmine.SpyObj<ImageUtilsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    photosService.getPhoto.and.returnValue(of(mockPhoto));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photo on init', () => {
    fixture.detectChanges(); // triggers ngOnInit

    expect(photosService.getPhoto).toHaveBeenCalledWith(1);
    expect(component.photo).toEqual({ ...mockPhoto, loading: true });
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading photo', () => {
    photosService.getPhoto.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Error loading photo:', jasmine.any(Error));
    expect(component.loading).toBeFalse();
    expect(component.photo).toBeNull();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should handle non-numeric route params', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PhotoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'invalid' })
          }
        },
        { provide: PhotosService, useValue: photosService },
        { provide: Location, useValue: location },
        { provide: ImageUtilsService, useValue: imageUtils }
      ]
    });

    const newFixture = TestBed.createComponent(PhotoDetailComponent);
    newFixture.detectChanges();

    expect(photosService.getPhoto).toHaveBeenCalledWith(NaN);
  });

  it('should handle multiple route param changes', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    const paramsSubscriptionSpy = spyOn(activatedRoute.params, 'subscribe').and.callThrough();

    fixture.detectChanges();

    expect(paramsSubscriptionSpy).toHaveBeenCalled();
    expect(photosService.getPhoto).toHaveBeenCalledWith(1);
  });

  it('should initialize with correct default values', () => {
    expect(component.photo).toBeNull();
    expect(component.loading).toBeFalse();
  });

  it('should handle image loading state', () => {
    fixture.detectChanges();
    expect(component.photo?.loading).toBeTrue();
  });

  it('should handle image error', () => {
    const mockEvent = new Event('error');
    fixture.detectChanges();
    
    imageUtils.handleImageError(mockEvent);
    
    expect(imageUtils.handleImageError).toHaveBeenCalledWith(mockEvent);
  });

  it('should set loading state during photo fetch', fakeAsync(() => {
    // Setup delayed response for the photo service
    photosService.getPhoto.and.returnValue(
      of(mockPhoto).pipe(delay(100))
    );

    // Initial state
    expect(component.loading).toBeFalse();
    
    // Load photo
    component.loadPhoto(1);
    
    // Check loading state is true immediately after calling loadPhoto
    expect(component.loading).toBeTrue();
    
    // Process pending timers
    tick(100);
    
    // After completion, loading should be false
    expect(component.loading).toBeFalse();
    // Photo should be loaded with loading state
    expect(component.photo).toEqual({ ...mockPhoto, loading: true });
  }));
});
