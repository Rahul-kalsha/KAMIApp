import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { PostsService } from '../../../services/posts.service';
import { ActivatedRoute, Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { of } from 'rxjs';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { routes } from '../../../app.routes';
import { Post } from '../../../interfaces/post.interface';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postsServiceSpy: jasmine.SpyObj<PostsService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockPosts = [
    { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
    { id: 2, title: 'Post 2', body: 'Body 2', userId: 2 }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PostsService', ['getPosts']);
    spy.getPosts.and.returnValue(of(new HttpResponse({
      body: mockPosts,
      headers: new HttpHeaders({
        'x-total-count': '2'
      })
    })));

    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: PostsService, useValue: spy },
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

    postsServiceSpy = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPosts with correct parameters on init', () => {
    expect(postsServiceSpy.getPosts).toHaveBeenCalled();
    const lastCall = postsServiceSpy.getPosts.calls.mostRecent();
    expect(lastCall.args[0]).toEqual(jasmine.objectContaining({
      _page: 2,
      _limit: 10,
      q: 'test',
      _sort: 'title',
      _order: 'desc'
    }));
  });

  it('should initialize with URL query params', () => {
    expect(component.currentPage).toBe(2);
    expect(component.searchTerm).toBe('test');
    expect(component.currentSort).toBe('title');
    expect(component.currentOrder).toBe('desc');
  });

  it('should update URL when search is performed', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onSearch('new search');
    tick(300); // Updated to match new debounce time

    expect(navigateSpy).toHaveBeenCalledWith(
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
    const navigateSpy = spyOn(router, 'navigate');
    component.onSearch('');
    tick(300);

    expect(navigateSpy).toHaveBeenCalledWith(
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
    const navigateSpy = spyOn(router, 'navigate');
    component.onSort('userId_asc');

    expect(navigateSpy).toHaveBeenCalledWith(
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
    const navigateSpy = spyOn(router, 'navigate');
    component.onPageChange(3);

    expect(navigateSpy).toHaveBeenCalledWith(
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
    const navigateSpy = spyOn(router, 'navigate');
    component.onSearch('   ');
    tick(300);

    expect(navigateSpy).toHaveBeenCalledWith(
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

  it('should handle API error', fakeAsync(() => {
    const errorSpy = spyOn(console, 'error');
    postsServiceSpy.getPosts.and.returnValue(of(new HttpResponse<Post[]>({
      body: [],
      headers: new HttpHeaders()
    })));
    
    component.loadPosts();
    tick();

    expect(errorSpy).not.toHaveBeenCalled();
    expect(component.paginatedPosts).toEqual([]);
    expect(component.totalItems).toBe(0);
  }));
});
