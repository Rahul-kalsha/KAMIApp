import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { AlbumsService } from '../../services/albums.service';
import { PhotosService } from '../../services/photos.service';
import * as rxjs from 'rxjs';
import { Photo } from '../../interfaces/photo.interface';

interface TopPost {
  title: string;
  excerpt: string;
  author: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly PLACEHOLDER_IMAGE = '/assets/images/placeholder.jpg';
  private postsService = inject(PostsService);
  private albumsService = inject(AlbumsService);
  private photosService = inject(PhotosService);

  statistics = {
    posts: 0,
    albums: 0,
    photos: 0
  };
  recentPhotos: Photo[] = [];
  topPosts: TopPost[] = [];

  ngOnInit(): void {
    this.loadStatistics();
    this.loadRecentPhotos();
    this.loadTopPosts();
  }

  private loadStatistics(): void {
    rxjs.forkJoin({
      posts: this.postsService.getPosts(),
      albums: this.albumsService.getAlbums(),
      photos: this.photosService.getPhotos()
    }).subscribe(data => {
      this.statistics = {
        posts: Array.isArray(data.posts) ? data.posts.length : 0,
        albums: Array.isArray(data.albums) ? data.albums.length : 0,
        photos: Array.isArray(data.photos) ? data.photos.length : 0,
      };
    });
  }

  private loadRecentPhotos(): void {
    this.photosService.getPhotos().subscribe(photos => {
      if (Array.isArray(photos)) {
        this.recentPhotos = photos.slice(0, 12); // Get first 12 photos
        this.recentPhotos = this.recentPhotos.map(photo => ({
          ...photo,
          loading: true
        }));
      }
    });
  }

  private loadTopPosts(): void {
    // This would typically come from a service
    this.topPosts = [
      {
        title: 'Sunt Aut Facere Repellat Provident Occaecati Excepturi Optio Reprehenderit',
        excerpt: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        author: 'Bret'
      },
      {
        title: 'Et Ea Vero Quia Laudantium Autem',
        excerpt: 'delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus accusamus in eum beatae sit vel qui neque voluptates ut commodi qui incidunt ut animi commodi',
        author: 'Samantha'
      },
      // Add more posts as needed
    ];
  }
 
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.PLACEHOLDER_IMAGE;
    }
  }
}
