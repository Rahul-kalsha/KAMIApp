import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AlbumsService } from '../../../services/albums.service';
import { Location } from '@angular/common';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { Album } from '../../../interfaces/album.interface';
import { PhotosService } from '../../../services/photos.service';
import { Photo } from '../../../interfaces/photo.interface';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, RouterModule],
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {
  album: Album | null = null;
  loading = false;
  photos: Photo[] = [];
  private readonly PLACEHOLDER_IMAGE = '/assets/images/placeholder.jpg';

  constructor(
    private route: ActivatedRoute,
    private albumsService: AlbumsService,
    private photosService: PhotosService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadAlbum(id);
      this.loadAlbumPhotos(id);
    });
  }

  loadAlbum(id: number) {
    this.loading = true;
    this.albumsService.getAlbum(id).subscribe({
      next: (data) => {
        this.album = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading album:', error);
        this.loading = false;
      }
    });
  }

  loadAlbumPhotos(id: number) {
    this.photosService.getPhotos({ albumId: id}).subscribe({
      next: (data) => {
        this.photos = data.map(photo => ({
          ...photo,
          loading: true
        }));
      },
      error: (error) => {
        console.error('Error loading photos:', error);
      }
    });
  }
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.PLACEHOLDER_IMAGE;
    }
  }
  goBack() {
    this.location.back();
  }
}
