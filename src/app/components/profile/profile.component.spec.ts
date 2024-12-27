import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { PostsService } from '../../services/posts.service';
import { of, throwError, delay } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { User } from '../../interfaces/user.interface';
import { Post } from '../../interfaces/post.interface';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let postsService: jasmine.SpyObj<PostsService>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    phone: '1234567890',
    website: 'test.com',
    company: {
      name: 'Test Company',
      catchPhrase: 'Test Phrase',
      bs: 'Test BS'
    },
    address: {
      street: 'Test Street',
      suite: 'Test Suite',
      city: 'Test City',
      zipcode: '12345',
      geo: {
        lat: '0',
        lng: '0'
      }
    }
  };

  const mockPosts: Post[] = [
    { id: 1, userId: 1, title: 'Test Post 1', body: 'Test Body 1' },
    { id: 2, userId: 1, title: 'Test Post 2', body: 'Test Body 2' }
  ];

  const mockPostsResponse = new HttpResponse({
    body: mockPosts,
    headers: new Map([['x-total-count', '2']]) as any
  });

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUser']);
    const postsServiceSpy = jasmine.createSpyObj('PostsService', ['getPosts']);
    
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: PostsService, useValue: postsServiceSpy }
      ]
    }).compileComponents();

    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    usersService.getUser.and.returnValue(of(mockUser));
    postsService.getPosts.and.returnValue(of(mockPostsResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile and posts on init', () => {
    fixture.detectChanges(); // triggers ngOnInit

    expect(usersService.getUser).toHaveBeenCalledWith(1);
    expect(postsService.getPosts).toHaveBeenCalledWith({ userId: 1 });
    expect(component.user).toEqual(mockUser);
    expect(component.posts).toEqual(mockPosts);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading user', () => {
    usersService.getUser.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Error loading user:', jasmine.any(Error));
    expect(component.loading).toBeFalse();
    expect(component.user).toBeNull();
  });

  it('should handle error when loading posts', () => {
    postsService.getPosts.and.returnValue(throwError(() => new Error('Test error')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Error loading posts:', jasmine.any(Error));
    expect(component.loading).toBeFalse();
  });

  it('should handle null posts response', () => {
    const nullResponse = new HttpResponse<Post[]>({
      body: null,
      headers: new Map([['x-total-count', '0']]) as any
    });
    postsService.getPosts.and.returnValue(of(nullResponse));

    fixture.detectChanges();

    expect(component.posts).toEqual([]);
  });

  it('should handle non-numeric user ID', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'invalid'
              }
            }
          }
        },
        { provide: UsersService, useValue: usersService },
        { provide: PostsService, useValue: postsService }
      ]
    });

    const newFixture = TestBed.createComponent(ProfileComponent);
    newFixture.detectChanges();

    expect(usersService.getUser).toHaveBeenCalledWith(NaN);
  });

  it('should initialize with correct default values', () => {
    expect(component.user).toBeNull();
    expect(component.posts).toEqual([]);
    expect(component.loading).toBeFalse();
  });

  it('should set loading state during profile fetch', fakeAsync(() => {
    // Setup delayed responses for the services
    usersService.getUser.and.returnValue(
      of(mockUser).pipe(delay(100))
    );

    postsService.getPosts.and.returnValue(
      of(mockPostsResponse).pipe(delay(100))
    );

    // Initial state
    expect(component.loading).toBeFalse();
    
    // Start loading
    component.loadUserProfile();
    
    // Check loading state is true during loading
    expect(component.loading).toBeTrue();
    
    // Process all pending timers
    tick(200);
    
    // After completion, loading should be false
    expect(component.loading).toBeFalse();
  }));

  it('should load user posts after user data is loaded', () => {
    fixture.detectChanges();
    
    expect(postsService.getPosts).toHaveBeenCalledWith({ userId: mockUser.id });
    expect(component.posts).toEqual(mockPosts);
  });
});
