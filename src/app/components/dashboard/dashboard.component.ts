import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { AlbumsService } from '../../services/albums.service';
import { PhotosService } from '../../services/photos.service';
import * as rxjs from 'rxjs';
import { Photo } from '../../interfaces/photo.interface';
import { Post } from '../../interfaces/post.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule, RouterModule],
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
  topPosts: Post[] = [];

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
    this.postsService.getPosts().subscribe(posts => {
      if (Array.isArray(posts)) {
        this.topPosts = posts.slice(0, 6); // Get first 6 posts
        this.topPosts = this.topPosts.map(post => ({
          ...post,
          author: 'Bret'
        }));
      }
    });
  }
 
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.PLACEHOLDER_IMAGE;
    }
  }
}
