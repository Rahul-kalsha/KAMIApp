import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Photo } from '../../../interfaces/photo.interface';
import { PhotosService } from '../../../services/photos.service';
import { SortComponent } from '../../../shared/components/sort/sort.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PaginationParams } from '../../../interfaces/pagination-params.interface';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ImageUtilsService } from '../../../shared/services/image-utils.service';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, SortComponent, NgbPaginationModule, RouterModule, SpinnerComponent],
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit, OnDestroy {
  photos: Photo[] = [];
  currentPage = 1;
  itemsPerPage = 12;
  loading = false;
  totalItems = 0;
  currentSort = '';
  currentOrder: 'asc' | 'desc' = 'asc';
  searchTerm = '';

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  
  sortOptions = [
    { label: 'Title (A-Z)', value: 'title_asc' },
    { label: 'Title (Z-A)', value: 'title_desc' },
    { label: 'Album ID (Asc)', value: 'albumId_asc' },
    { label: 'Album ID (Desc)', value: 'albumId_desc' }
  ];

  constructor(
    private photosService: PhotosService, 
    private router: Router,
    private route: ActivatedRoute,
    public imageUtils: ImageUtilsService
  ) {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.loadPhotos();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = Number(params['page']) || 1;
      this.searchTerm = params['search'] || '';
      if (params['sort']) {
        const [field, order] = params['sort'].split('_');
        this.currentSort = field;
        this.currentOrder = order as 'asc' | 'desc';
      }
      
      if (!this.loading) {
        this.loadPhotos();
      }
    });
  }

  private updateQueryParams() {
    const queryParams = { ...this.route.snapshot.queryParams };
    
    queryParams['page'] = this.currentPage;

    if (this.searchTerm?.trim()) {
      queryParams['search'] = this.searchTerm;
    } else {
      delete queryParams['search'];
    }

    if (this.currentSort) {
      queryParams['sort'] = `${this.currentSort}_${this.currentOrder}`;
    } else {
      delete queryParams['sort'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  loadPhotos() {
    this.loading = true;

    const params: PaginationParams = {
      _page: this.currentPage,
      _limit: this.itemsPerPage
    };

    if (this.searchTerm?.trim()) {
      params.q = this.searchTerm;
    }

    if (this.currentSort) {
      params._sort = this.currentSort;
      params._order = this.currentOrder;
    }

    this.updateQueryParams();

    this.photosService.getPhotos(params).subscribe({
      next: (response) => {
        this.photos = (response.body || []).map(photo => ({
          ...photo,
          loading: true
        }));
        this.totalItems = Number(response.headers.get('x-total-count')) || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading photos:', error);
        this.loading = false;
      }
    });
  }

  onSearch(searchText: string) {
    this.searchSubject.next(searchText);
  }

  onSort(sortBy: string) {
    this.currentPage = 1;
    const [field, order] = sortBy.split('_');
    this.currentSort = field;
    this.currentOrder = order as 'asc' | 'desc';
    this.loadPhotos();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPhotos();
  }

  onPhotoClick(photoId: number) {
    this.router.navigate(['/photos', photoId]);
  }

  getSortValue(): string {
    return this.currentSort ? `${this.currentSort}_${this.currentOrder}` : '';
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
