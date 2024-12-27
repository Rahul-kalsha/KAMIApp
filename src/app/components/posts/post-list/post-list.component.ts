import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../../interfaces/post.interface';
import { PostsService } from '../../../services/posts.service';
import { SortComponent } from '../../../shared/components/sort/sort.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { PaginationParams } from '../../../interfaces/pagination-params.interface';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, SortComponent, NgbPaginationModule, RouterModule, SpinnerComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {
  paginatedPosts: Post[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  loading = false;
  totalItems = 0;
  currentSort = '';
  currentOrder: 'asc' | 'desc' = 'asc';
  searchTerm = '';
  
  sortOptions = [
    { label: 'Title (A-Z)', value: 'title_asc' },
    { label: 'Title (Z-A)', value: 'title_desc' },
    { label: 'User Id (A-Z)', value: 'userId_asc' },
    { label: 'User Id (Z-A)', value: 'userId_desc' }
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private postsService: PostsService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the debounced search
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(800),  // Wait 500ms after the last event
      distinctUntilChanged()  // Only emit if value is different from previous
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.loadPosts();
    });
  }

  ngOnInit() {
    // Subscribe to query params changes
    this.route.queryParams.subscribe(params => {
      // Initialize state from URL params without triggering API call
      this.currentPage = Number(params['page']) || 1;
      this.searchTerm = params['search'] || '';
      if (params['sort']) {
        const [field, order] = params['sort'].split('_');
        this.currentSort = field;
        this.currentOrder = order as 'asc' | 'desc';
      }
      
      // Only load posts if this is the initial load
      if (!this.loading) {
        this.loadPosts();
      }
    });
  }

  // Update URL with current state
  private updateQueryParams() {
    const queryParams = { ...this.route.snapshot.queryParams };
    
    // Always update page
    queryParams['page'] = this.currentPage;

    // Handle search param - remove if empty
    if (this.searchTerm?.trim()) {
      queryParams['search'] = this.searchTerm;
    } else {
      delete queryParams['search'];
    }

    // Handle sort param
    if (this.currentSort) {
      queryParams['sort'] = `${this.currentSort}_${this.currentOrder}`;
    }

    // Navigate with updated params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  loadPosts() {
    this.loading = true;
    
    const params: PaginationParams = {
      _page: this.currentPage,
      _limit: this.itemsPerPage
    };

    // Only add search param if non-empty
    if (this.searchTerm?.trim()) {
      params.q = this.searchTerm;
    }

    if (this.currentSort) {
      params._sort = this.currentSort;
      params._order = this.currentOrder;
    }

    // Update URL first
    this.updateQueryParams();

    // Then make the API call
    this.postsService.getPosts(params).subscribe({
      next: (response) => {
        this.paginatedPosts = response.body || [];
        this.totalItems = Number(response.headers.get('x-total-count')) || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });
  }

  onSearch(searchText: string) {
    this.searchTerm = searchText;
    this.currentPage = 1;
    this.loadPosts();
  }

  onSort(sortBy: string) {
    this.currentPage = 1;
    const [field, order] = sortBy.split('_');
    this.currentSort = field;
    this.currentOrder = order as 'asc' | 'desc';
    this.loadPosts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPosts();
  }

  onPostClick(postId: number) {
    this.router.navigate(['/posts', postId]);
  }
  onUserClick(userId: number) {
    this.router.navigate(['/profile', userId]);
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getSortValue(): string {
    return this.currentSort ? this.currentSort + '_' + this.currentOrder : '';
  }
}
