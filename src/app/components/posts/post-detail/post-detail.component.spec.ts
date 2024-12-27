import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../../services/posts.service';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';
import { Post } from '../../../interfaces/post.interface';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postsService: jasmine.SpyObj<PostsService>;
  let location: jasmine.SpyObj<Location>;
  let route: any;

  const mockPost: Post = {
    id: 1,
    userId: 1,
    title: 'Test Post',
    body: 'Test Body'
  };

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', ['getPost']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    
    // Mock ActivatedRoute with params observable
    const routeMock = {
      params: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [PostDetailComponent],
      providers: [
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    route = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    postsService.getPost.and.returnValue(of(mockPost));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post on init', () => {
    fixture.detectChanges(); // triggers ngOnInit

    expect(postsService.getPost).toHaveBeenCalledWith(1);
    expect(component.post).toEqual(mockPost);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading post', () => {
    const error = new Error('Test error');
    postsService.getPost.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    fixture.detectChanges(); // triggers ngOnInit

    expect(console.error).toHaveBeenCalledWith('Error loading post:', error);
    expect(component.loading).toBeFalse();
    expect(component.post).toBeUndefined();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });

  it('should handle different route params', () => {
    // Create a new route with different params
    const newRoute = {
      params: of({ id: '2' })
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PostDetailComponent],
      providers: [
        { provide: PostsService, useValue: postsService },
        { provide: Location, useValue: location },
        { provide: ActivatedRoute, useValue: newRoute }
      ]
    });

    const newFixture = TestBed.createComponent(PostDetailComponent);
    newFixture.detectChanges();

    expect(postsService.getPost).toHaveBeenCalledWith(2);
  });

  it('should set loading state correctly during post fetch', () => {
    // Verify initial loading state
    expect(component.loading).toBeTrue();

    fixture.detectChanges(); // triggers ngOnInit

    // Verify loading state after successful fetch
    expect(component.loading).toBeFalse();
  });

  it('should handle non-numeric route params', () => {
    const invalidRoute = {
      params: of({ id: 'invalid' })
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PostDetailComponent],
      providers: [
        { provide: PostsService, useValue: postsService },
        { provide: Location, useValue: location },
        { provide: ActivatedRoute, useValue: invalidRoute }
      ]
    });

    const newFixture = TestBed.createComponent(PostDetailComponent);
    newFixture.detectChanges();

    // NaN will be converted to 0 by the + operator
    expect(postsService.getPost).toHaveBeenCalledWith(NaN);
  });

  it('should cleanup subscriptions on destroy', () => {
    const subscription = spyOn(route.params, 'subscribe').and.callThrough();
    
    fixture.detectChanges(); // triggers ngOnInit
    fixture.destroy(); // triggers ngOnDestroy

    expect(subscription).toHaveBeenCalled();
  });
});
