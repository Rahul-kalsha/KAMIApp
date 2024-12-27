import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumDetailComponent } from './album-detail.component';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../../../services/albums.service';
import { PhotosService } from '../../../services/photos.service';
import { Location } from '@angular/common';
import { ImageUtilsService } from '../../../shared/services/image-utils.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Album } from '../../../interfaces/album.interface';
import { Photo } from '../../../interfaces/photo.interface';

describe('AlbumDetailComponent', () => {
  let component: AlbumDetailComponent;
  let fixture: ComponentFixture<AlbumDetailComponent>;
  let albumsService: jasmine.SpyObj<AlbumsService>;
  let photosService: jasmine.SpyObj<PhotosService>;
  let location: jasmine.SpyObj<Location>;
  let imageUtils: jasmine.SpyObj<ImageUtilsService>;

  const mockAlbum: Album = {
    id: 1,
    userId: 1,
    title: 'Test Album'
  };

  const mockPhotos: Photo[] = [
    { id: 1, albumId: 1, title: 'Photo 1', url: 'url1', thumbnailUrl: 'thumb1' },
    { id: 2, albumId: 1, title: 'Photo 2', url: 'url2', thumbnailUrl: 'thumb2' }
  ];

  const mockPhotosResponse = new HttpResponse({
    body: mockPhotos,
    headers: new Map([['x-total-count', '2']]) as any
  });

  beforeEach(async () => {
    const albumsServiceSpy = jasmine.createSpyObj('AlbumsService', ['getAlbum']);
    const photosServiceSpy = jasmine.createSpyObj('PhotosService', ['getPhotos']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    const imageUtilsSpy = jasmine.createSpyObj('ImageUtilsService', ['handleImageError']);

    await TestBed.configureTestingModule({
      imports: [AlbumDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        },
        { provide: AlbumsService, useValue: albumsServiceSpy },
        { provide: PhotosService, useValue: photosServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ImageUtilsService, useValue: imageUtilsSpy }
      ]
    }).compileComponents();

    albumsService = TestBed.inject(AlbumsService) as jasmine.SpyObj<AlbumsService>;
    photosService = TestBed.inject(PhotosService) as jasmine.SpyObj<PhotosService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    imageUtils = TestBed.inject(ImageUtilsService) as jasmine.SpyObj<ImageUtilsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumDetailComponent);
    component = fixture.componentInstance;
    
    albumsService.getAlbum.and.returnValue(of(mockAlbum));
    photosService.getPhotos.and.returnValue(of(mockPhotosResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load album and photos on init', () => {
    fixture.detectChanges(); // triggers ngOnInit

    expect(albumsService.getAlbum).toHaveBeenCalledWith(1);
    expect(photosService.getPhotos).toHaveBeenCalledWith({ albumId: 1 });
    expect(component.album).toEqual(mockAlbum);
    expect(component.photos.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading album', () => {
    albumsService.getAlbum.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Error loading album:', jasmine.any(Error));
    expect(component.loading).toBeFalse();
    expect(component.album).toBeNull();
  });

  it('should handle error when loading photos', () => {
    photosService.getPhotos.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Error loading photos:', jasmine.any(Error));
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should handle null photos response', () => {
    const nullResponse = new HttpResponse<Photo[]>({
      body: null,
      headers: new Map([['x-total-count', '0']]) as any
    });
    photosService.getPhotos.and.returnValue(of(nullResponse));

    fixture.detectChanges();

    expect(component.photos).toEqual([]);
  });

  it('should initialize photos with loading state', () => {
    fixture.detectChanges();

    component.photos.forEach(photo => {
      expect(photo.loading).toBeTrue();
    });
  });

  it('should handle non-numeric route params', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AlbumDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'invalid' })
          }
        },
        { provide: AlbumsService, useValue: albumsService },
        { provide: PhotosService, useValue: photosService },
        { provide: Location, useValue: location },
        { provide: ImageUtilsService, useValue: imageUtils }
      ]
    });

    const newFixture = TestBed.createComponent(AlbumDetailComponent);
    newFixture.detectChanges();

    expect(albumsService.getAlbum).toHaveBeenCalledWith(NaN);
  });

  it('should handle multiple route param changes', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.params, 'subscribe').and.callThrough();

    fixture.detectChanges();

    expect(route.params.subscribe).toHaveBeenCalled();
    expect(albumsService.getAlbum).toHaveBeenCalledWith(1);
    expect(photosService.getPhotos).toHaveBeenCalledWith({ albumId: 1 });
  });

  it('should initialize with correct default values', () => {
    expect(component.album).toBeNull();
    expect(component.loading).toBeFalse();
    expect(component.photos).toEqual([]);
  });
});
