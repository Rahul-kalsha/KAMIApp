import { Component, OnInit } from '@angular/core';
import { PhotosService } from '../../../services/photos.service';
import { Photo } from '../../../interfaces/photo.interface';
import { SortComponent } from '../../../shared/components/sort/sort.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, SearchComponent, SortComponent, SpinnerComponent],
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit {
  photos: Photo[] = [];
  filteredPhotos: Photo[] = [];
  paginatedPhotos: Photo[] = [];
  loading = false;
  private readonly PLACEHOLDER_IMAGE = '/assets/images/placeholder.jpg';
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  
  sortOptions = [
    { label: 'Title (A-Z)', value: 'title_asc' },
    { label: 'Title (Z-A)', value: 'title_desc' },
    { label: 'Album ID (Asc)', value: 'albumId_asc' },
    { label: 'Album ID (Desc)', value: 'albumId_desc' }
  ];

  constructor(private photosService: PhotosService, private router: Router) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos(params?: Record<string, any>) {
    this.loading = true;
    this.photosService.getPhotos(params).subscribe({
      next: (data) => {
        this.photos = data;
        this.filteredPhotos = [...data];
        this.filteredPhotos = this.filteredPhotos.map(photo => ({
          ...photo,
          loading: true
        }));

        this.updatePaginatedPhotos();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading photos:', error);
        this.loading = false;
      }
    });
  }

  updatePaginatedPhotos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedPhotos = this.filteredPhotos.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  onSearch(searchText: string) {
    if (searchText) {
      this.filteredPhotos = this.photos.filter(photo => 
        photo.title.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.filteredPhotos = [...this.photos];
    }
    this.currentPage = 1;
    this.updatePaginatedPhotos();
  }

  onSort(sortBy: string) {
    this.currentPage = 1;
    switch(sortBy) {
      case 'title_asc':
        this.filteredPhotos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        this.filteredPhotos.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'albumId_asc':
        this.filteredPhotos.sort((a, b) => a.albumId - b.albumId);
        break;
      case 'albumId_desc':
        this.filteredPhotos.sort((a, b) => b.albumId - a.albumId);
        break;
    }
    this.updatePaginatedPhotos();
  }
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.PLACEHOLDER_IMAGE;
    }
  }
  onPhotoClick(photoId: number) {
    this.router.navigate(['/photos', photoId]);
  }
}
