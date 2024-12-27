import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PostsService } from '../../services/posts.service';
import { AlbumsService } from '../../services/albums.service';
import { PhotosService } from '../../services/photos.service';
import { ImageUtilsService } from '../../shared/services/image-utils.service';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Photo } from '../../interfaces/photo.interface';
import { Post } from '../../interfaces/post.interface';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let postsService: jasmine.SpyObj<PostsService>;
  let albumsService: jasmine.SpyObj<AlbumsService>;
  let photosService: jasmine.SpyObj<PhotosService>;
  let imageUtils: jasmine.SpyObj<ImageUtilsService>;

  const mockPhotos: Photo[] = [
    { id: 1, albumId: 1, title: 'Photo 1', url: 'url1', thumbnailUrl: 'thumb1' },
    { id: 2, albumId: 1, title: 'Photo 2', url: 'url2', thumbnailUrl: 'thumb2' }
  ];

  const mockPosts: Post[] = [
    { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
    { id: 2, userId: 1, title: 'Post 2', body: 'Body 2' }
  ];

  const mockPhotosResponse = new HttpResponse({
    body: mockPhotos,
    headers: new Map([['x-total-count', '50']]) as any
  });

  const mockPostsResponse = new HttpResponse({
    body: mockPosts,
    headers: new Map([['x-total-count', '100']]) as any
  });

  const mockAlbumsResponse = new HttpResponse({
    body: [],
    headers: new Map([['x-total-count', '20']]) as any
  });

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', ['getPosts']);
    const albumsServiceSpy = jasmine.createSpyObj('AlbumsService', ['getAlbums']);
    const photosServiceSpy = jasmine.createSpyObj('PhotosService', ['getPhotos']);
    const imageUtilsSpy = jasmine.createSpyObj('ImageUtilsService', ['handleImageError']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent
      ],
      providers: [
        provideRouter([]),
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: AlbumsService, useValue: albumsServiceSpy },
        { provide: PhotosService, useValue: photosServiceSpy },
        { provide: ImageUtilsService, useValue: imageUtilsSpy }
      ]
    }).compileComponents();

    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    albumsService = TestBed.inject(AlbumsService) as jasmine.SpyObj<AlbumsService>;
    photosService = TestBed.inject(PhotosService) as jasmine.SpyObj<PhotosService>;
    imageUtils = TestBed.inject(ImageUtilsService) as jasmine.SpyObj<ImageUtilsService>;

    postsService.getPosts.and.returnValue(of(mockPostsResponse));
    albumsService.getAlbums.and.returnValue(of(mockAlbumsResponse));
    photosService.getPhotos.and.returnValue(of(mockPhotosResponse));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load statistics on init', () => {
    fixture.detectChanges();

    expect(component.statistics).toEqual({
      posts: 100,
      albums: 20,
      photos: 50
    });
  });

  it('should handle missing total count headers in statistics', () => {
    const emptyPostsResponse = new HttpResponse<Post[]>({
      body: [],
      headers: new Map() as any
    });
    
    const emptyAlbumsResponse = new HttpResponse<any[]>({
      body: [],
      headers: new Map() as any
    });
    
    const emptyPhotosResponse = new HttpResponse<Photo[]>({
      body: [],
      headers: new Map() as any
    });

    postsService.getPosts.and.returnValue(of(emptyPostsResponse));
    albumsService.getAlbums.and.returnValue(of(emptyAlbumsResponse));
    photosService.getPhotos.and.returnValue(of(emptyPhotosResponse));

    fixture.detectChanges();

    expect(component.statistics).toEqual({
      posts: 0,
      albums: 0,
      photos: 0
    });
  });

  it('should load recent photos with loading state', () => {
    fixture.detectChanges();

    expect(photosService.getPhotos).toHaveBeenCalledWith({ _limit: 20 });
    expect(component.recentPhotos.length).toBe(2);
    component.recentPhotos.forEach(photo => {
      expect(photo.loading).toBeTrue();
    });
  });

  it('should handle null response when loading photos', () => {
    const nullResponse = new HttpResponse<Photo[]>({
      body: [],
      headers: new Map([['x-total-count', '0']]) as any
    });
    photosService.getPhotos.and.returnValue(of(nullResponse));

    fixture.detectChanges();

    expect(component.recentPhotos).toEqual([]);
  });

  it('should load top posts with author', () => {
    fixture.detectChanges();

    expect(postsService.getPosts).toHaveBeenCalledWith({ _limit: 6 });
    expect(component.topPosts.length).toBe(2);
    component.topPosts.forEach(post => {
      expect(post.author).toBe('Bret');
    });
  });

  it('should handle null response when loading posts', () => {
    const nullResponse = new HttpResponse<Post[]>({
      body: [],
      headers: new Map([['x-total-count', '0']]) as any
    });
    postsService.getPosts.and.returnValue(of(nullResponse));

    fixture.detectChanges();

    expect(component.topPosts).toEqual([]);
  });

  it('should handle image error', () => {
    const mockEvent = new Event('error');
    fixture.detectChanges();
    
    imageUtils.handleImageError(mockEvent);
    
    expect(imageUtils.handleImageError).toHaveBeenCalledWith(mockEvent);
  });

  it('should initialize with correct default values', () => {
    expect(component.statistics).toEqual({
      posts: 0,
      albums: 0,
      photos: 0
    });
    expect(component.recentPhotos).toEqual([]);
    expect(component.topPosts).toEqual([]);
  });
});
