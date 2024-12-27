import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlbumListComponent } from './album-list.component';
import { AlbumsService } from '../../../services/albums.service';
import { ActivatedRoute, Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Album } from '../../../interfaces/album.interface';
import { routes } from '../../../app.routes';

describe('AlbumListComponent', () => {
  let component: AlbumListComponent;
  let fixture: ComponentFixture<AlbumListComponent>;
  let albumsService: jasmine.SpyObj<AlbumsService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockAlbums: Album[] = [
    { id: 1, userId: 1, title: 'Test Album 1' },
    { id: 2, userId: 2, title: 'Test Album 2' }
  ];

  const mockResponse = new HttpResponse({
    body: mockAlbums,
    headers: new Map([['x-total-count', '2']]) as any
  });

  beforeEach(async () => {
    const albumsServiceSpy = jasmine.createSpyObj('AlbumsService', ['getAlbums']);
    albumsServiceSpy.getAlbums.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [AlbumListComponent],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: AlbumsService, useValue: albumsServiceSpy },
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

    albumsService = TestBed.inject(AlbumsService) as jasmine.SpyObj<AlbumsService>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumListComponent);
    component = fixture.componentInstance;
    
    // Reset component state
    component.currentPage = 1;
    component.searchTerm = '';
    component.currentSort = '';
    component.currentOrder = 'asc';
    
    // Set up router spy
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
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
    // Set initial state
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
    // Set up initial state
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    component.searchTerm = 'test';  // Set initial search term
    
    // Trigger empty search
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
    // Set initial state
    component.searchTerm = 'test';
    
    component.onSort('userId_asc');

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: {
          page: 1,
          search: 'test',
          sort: 'userId_asc'
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

  it('should handle whitespace in search term', fakeAsync(() => {
    // Set initial state
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    
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

  it('should load albums on init', () => {
    // Reset route params
    (activatedRoute.queryParams as any) = of({});
    
    component.ngOnInit();
    
    expect(albumsService.getAlbums).toHaveBeenCalledWith({
      _page: 1,
      _limit: 10
    });
    expect(component.albums).toEqual(mockAlbums);
    expect(component.totalItems).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading albums', () => {
    albumsService.getAlbums.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');
    
    component.loadAlbums();
    
    expect(console.error).toHaveBeenCalledWith('Error loading albums:', jasmine.any(Error));
    expect(component.loading).toBeFalse();
  });

  it('should handle search with debounce', fakeAsync(() => {
    component.onSearch('test search');
    expect(component.loading).toBeFalse();
    
    tick(800); // Wait for debounce time
    
    expect(component.searchTerm).toBe('test search');
    expect(component.currentPage).toBe(1);
    expect(albumsService.getAlbums).toHaveBeenCalledWith({
      _page: 1,
      _limit: 10,
      q: 'test search'
    });
  }));

  it('should handle sort', () => {
    component.onSort('title_desc');
    
    expect(component.currentPage).toBe(1);
    expect(component.currentSort).toBe('title');
    expect(component.currentOrder).toBe('desc');
    expect(albumsService.getAlbums).toHaveBeenCalledWith({
      _page: 1,
      _limit: 10,
      _sort: 'title',
      _order: 'desc'
    });
  });

  it('should handle page change', () => {
    component.onPageChange(2);
    
    expect(component.currentPage).toBe(2);
    expect(albumsService.getAlbums).toHaveBeenCalledWith({
      _page: 2,
      _limit: 10
    });
  });

  it('should navigate to album details on album click', () => {
    component.onAlbumClick(1);
    expect(router.navigate).toHaveBeenCalledWith(['/albums', 1]);
  });

  it('should navigate to user profile on user click', () => {
    component.onUserClick(1);
    expect(router.navigate).toHaveBeenCalledWith(['/profile', 1]);
  });

  it('should load albums with search params when search term exists', () => {
    component.searchTerm = 'test';
    component.loadAlbums();
    
    expect(albumsService.getAlbums).toHaveBeenCalledWith({
      _page: 1,
      _limit: 10,
      q: 'test'
    });
  });

  it('should load albums with sort params when sort is applied', () => {
    component.currentSort = 'title';
    component.currentOrder = 'desc';
    component.loadAlbums();
    
    expect(albumsService.getAlbums).toHaveBeenCalledWith({
      _page: 1,
      _limit: 10,
      _sort: 'title',
      _order: 'desc'
    });
  });

  it('should handle null response body', () => {
    const nullResponse = new HttpResponse<Album[]>({
      body: [],
      headers: new Map([['x-total-count', '0']]) as any
    });
    albumsService.getAlbums.and.returnValue(of(nullResponse));
    
    component.loadAlbums();
    
    expect(component.albums).toEqual([]);
    expect(component.totalItems).toBe(0);
  });

  it('should unsubscribe from search subscription on destroy', () => {
    const subscription = spyOn(component['searchSubscription'] as any, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(subscription).toHaveBeenCalled();
  });

  it('should initialize with correct default values', () => {
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(10);
    expect(component.loading).toBeFalse();
    expect(component.currentSort).toBe('');
    expect(component.currentOrder).toBe('asc');
    expect(component.searchTerm).toBe('');
  });

  it('should have correct sort options', () => {
    expect(component.sortOptions).toEqual([
      { label: 'Title (A-Z)', value: 'title_asc' },
      { label: 'Title (Z-A)', value: 'title_desc' },
      { label: 'User ID (Asc)', value: 'userId_asc' },
      { label: 'User ID (Desc)', value: 'userId_desc' }
    ]);
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
    albumsService.getAlbums.and.returnValue(of(emptyResponse));
    
    component.loadAlbums();
    
    expect(component.albums).toEqual([]);
    expect(component.totalItems).toBe(0);
  });
});
