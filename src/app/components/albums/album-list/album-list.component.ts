import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Album } from '../../../interfaces/album.interface';
import { AlbumsService } from '../../../services/albums.service';
import { SortComponent } from '../../../shared/components/sort/sort.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, SortComponent, NgbPaginationModule, SpinnerComponent, RouterModule],
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {
  albums: Album[] = [];
  filteredAlbums: Album[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  loading = false;

  sortOptions = [
    { label: 'Title (A-Z)', value: 'title_asc' },
    { label: 'Title (Z-A)', value: 'title_desc' },
    { label: 'User ID (Asc)', value: 'userId_asc' },
    { label: 'User ID (Desc)', value: 'userId_desc' }
  ];

  constructor(private albumsService: AlbumsService, private router: Router) {}

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    this.loading = true;
    this.albumsService.getAlbums().subscribe({
      next: (albums) => {
        this.albums = albums;
        this.filteredAlbums = [...this.albums];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading albums:', error);
        this.loading = false;
      }
    });
  }

  onSearch(searchText: string) {
    this.currentPage = 1;
    this.filteredAlbums = this.albums.filter(album => 
      album.title.toLowerCase().includes(searchText.toLowerCase()) ||
      album.id?.toString().includes(searchText)
    );
  }

  onSort(sortBy: string) {
    this.currentPage = 1;
    switch(sortBy) {
      case 'title_asc':
        this.filteredAlbums.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        this.filteredAlbums.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'userId_asc':
        this.filteredAlbums.sort((a, b) => a.userId - b.userId);
        break;
      case 'userId_desc':
        this.filteredAlbums.sort((a, b) => b.userId - a.userId);
        break;
    }
  }

  get paginatedAlbums() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAlbums.slice(startIndex, startIndex + this.itemsPerPage);
  }
  onAlbumClick(albumId: number) {
    console.log('Album clicked:', albumId);
    this.router.navigate(['/albums', albumId]);
  }
  onUserClick(userId: number) {
    this.router.navigate(['/profile', userId]);
  }
}
