import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PhotoListComponent } from './photo-list.component';
import { PhotosService } from '../../../services/photos.service';
import { ActivatedRoute, Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { ImageUtilsService } from '../../../shared/services/image-utils.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Photo } from '../../../interfaces/photo.interface';
import { routes } from '../../../app.routes';

describe('PhotoListComponent', () => {
  let component: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;
  let photosService: jasmine.SpyObj<PhotosService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let imageUtils: jasmine.SpyObj<ImageUtilsService>;

  const mockPhotos: Photo[] = [
    { 
      id: 1, 
      albumId: 1, 
      title: 'Test Photo 1', 
      url: 'url1', 
      thumbnailUrl: 'thumb1' 
    },
    { 
      id: 2, 
      albumId: 2, 
      title: 'Test Photo 2', 
      url: 'url2', 
      thumbnailUrl: 'thumb2' 
    }
  ];

  const mockResponse = new HttpResponse({
    body: mockPhotos,
    headers: new Map([['x-total-count', '2']]) as any
  });

  beforeEach(async () => {
    const photosServiceSpy = jasmine.createSpyObj('PhotosService', ['getPhotos']);
    const imageUtilsSpy = jasmine.createSpyObj('ImageUtilsService', ['handleImageError']);
    photosServiceSpy.getPhotos.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [PhotoListComponent],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: PhotosService, useValue: photosServiceSpy },
        { provide: ImageUtilsService, useValue: imageUtilsSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              page: '2',
              search: 'test',
              sort: 'title_desc'
            }),
            snapshot: {
              queryParams: {
                page: '2',
                search: 'test',
                sort: 'title_desc'
              }
            }
          }
        }
      ]
    }).compileComponents();

    photosService = TestBed.inject(PhotosService) as jasmine.SpyObj<PhotosService>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    imageUtils = TestBed.inject(ImageUtilsService) as jasmine.SpyObj<ImageUtilsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoListComponent);
    component = fixture.componentInstance;
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with URL query params', () => {
    fixture.detectChanges();
    expect(component.currentPage).toBe(2);
    expect(component.searchTerm).toBe('test');
    expect(component.currentSort).toBe('title');
    expect(component.currentOrder).toBe('desc');
  });

  it('should update URL when search is performed', fakeAsync(() => {
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    
    component.onSearch('new search');
    tick(300);

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: {
          page: 1,
          search: 'new search',
          sort: 'title_desc'
        }
      }
    );
  }));

  it('should remove search param from URL when search is empty', fakeAsync(() => {
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    
    component.onSearch('');
    tick(300);

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: {
          page: 1,
          sort: 'title_desc'
        }
      }
    );
  }));

  it('should update URL when sort is changed', () => {
    component.searchTerm = 'test';
    
    component.onSort('albumId_asc');

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: {
          page: 1,
          search: 'test',
          sort: 'albumId_asc'
        }
      }
    );
  });

  it('should update URL when page is changed', () => {
    component.searchTerm = 'test';
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    
    component.onPageChange(3);

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: {
          page: 3,
          search: 'test',
          sort: 'title_desc'
        }
      }
    );
  });

  it('should load photos on init', () => {
    (activatedRoute.queryParams as any) = of({});
    component.currentPage = 1;
    component.searchTerm = '';
    component.currentSort = '';
    component.currentOrder = 'asc';
    
    (photosService.getPhotos as jasmine.Spy).calls.reset();
    
    component.ngOnInit();
    
    expect(photosService.getPhotos).toHaveBeenCalledWith({
      _page: 1,
      _limit: 12
    });
    expect(component.photos.length).toBe(2);
    expect(component.totalItems).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading photos', () => {
    photosService.getPhotos.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    
    component.loadPhotos();
    
    expect(console.error).toHaveBeenCalledWith('Error loading photos:', jasmine.any(Error));
    expect(component.loading).toBeFalse();
  });

  it('should handle search with debounce', fakeAsync(() => {
    component.onSearch('test search');
    expect(component.loading).toBeFalse();
    
    tick(800); // Wait for debounce time
    
    expect(component.searchTerm).toBe('test search');
    expect(component.currentPage).toBe(1);
    expect(photosService.getPhotos).toHaveBeenCalledWith({
      _page: 1,
      _limit: 12,
      q: 'test search'
    });
  }));

  it('should handle sort', () => {
    component.onSort('title_desc');
    
    expect(component.currentPage).toBe(1);
    expect(component.currentSort).toBe('title');
    expect(component.currentOrder).toBe('desc');
    expect(photosService.getPhotos).toHaveBeenCalledWith({
      _page: 1,
      _limit: 12,
      _sort: 'title',
      _order: 'desc'
    });
  });

  it('should navigate to photo details on photo click', () => {
    const navigateSpy = router.navigate as jasmine.Spy;
    component.onPhotoClick(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/photos', 1]);
  });

  it('should load photos with search params when search term exists', () => {
    component.searchTerm = 'test';
    component.loadPhotos();
    
    expect(photosService.getPhotos).toHaveBeenCalledWith({
      _page: 1,
      _limit: 12,
      q: 'test'
    });
  });

  it('should load photos with sort params when sort is applied', () => {
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    component.loadPhotos();
    
    expect(photosService.getPhotos).toHaveBeenCalledWith({
      _page: 1,
      _limit: 12,
      _sort: 'title',
      _order: 'desc'
    });
  });

  it('should handle null response body', () => {
    const nullResponse = new HttpResponse<Photo[]>({
      body: null,
      headers: new Map([['x-total-count', '0']]) as any
    });
    photosService.getPhotos.and.returnValue(of(nullResponse));
    
    component.loadPhotos();
    
    expect(component.photos).toEqual([]);
    expect(component.totalItems).toBe(0);
  });

  it('should unsubscribe from search subscription on destroy', () => {
    const subscription = spyOn(component['searchSubscription'] as any, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(subscription).toHaveBeenCalled();
  });

  it('should initialize with correct default values', () => {
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(12);
    expect(component.loading).toBeFalse();
    expect(component.currentSort).toBe('');
    expect(component.currentOrder).toBe('asc');
    expect(component.searchTerm).toBe('');
  });

  it('should have correct sort options', () => {
    expect(component.sortOptions).toEqual([
      { label: 'Title (A-Z)', value: 'title_asc' },
      { label: 'Title (Z-A)', value: 'title_desc' },
      { label: 'Album ID (Asc)', value: 'albumId_asc' },
      { label: 'Album ID (Desc)', value: 'albumId_desc' }
    ]);
  });

  it('should initialize photos with loading state', () => {
    component.ngOnInit();
    
    component.photos.forEach(photo => {
      expect(photo.loading).toBeTrue();
    });
  });

  it('should handle missing total count header', () => {
    const responseWithoutTotal = new HttpResponse({
      body: mockPhotos,
      headers: new Map() as any
    });
    photosService.getPhotos.and.returnValue(of(responseWithoutTotal));
    
    component.loadPhotos();
    
    expect(component.totalItems).toBe(0);
  });

  it('should handle image error using imageUtils service', () => {
    const mockEvent = new Event('error');
    component.ngOnInit();
    
    // Simulate image error
    const photo = component.photos[0];
    photo.loading = true;
    imageUtils.handleImageError(mockEvent);
    
    expect(imageUtils.handleImageError).toHaveBeenCalledWith(mockEvent);
  });

  it('should get correct sort value', () => {
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    expect(component.getSortValue()).toBe('title_desc');
  });

  it('should return empty string when no sort is set', () => {
    component.currentSort = '';
    expect(component.getSortValue()).toBe('');
  });

  it('should handle empty response', () => {
    const emptyResponse = new HttpResponse({
      body: [],
      headers: new Map([['x-total-count', '0']]) as any
    });
    photosService.getPhotos.and.returnValue(of(emptyResponse));
    
    component.loadPhotos();
    
    expect(component.photos).toEqual([]);
    expect(component.totalItems).toBe(0);
  });

  it('should handle image loading state', () => {
    fixture.detectChanges();
    const photo = component.photos[0];
    expect(photo.loading).toBeTrue();
    photo.loading = false;
    expect(photo.loading).toBeFalse();
  });

  it('should handle whitespace in search term', fakeAsync(() => {
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    component.searchTerm = 'test';
    
    component.onSearch('   ');
    tick(300);

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: {
          page: 1,
          sort: 'title_desc'
        }
      }
    );
  }));
});
