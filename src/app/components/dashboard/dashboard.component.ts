import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { AlbumsService } from '../../services/albums.service';
import { PhotosService } from '../../services/photos.service';
import * as rxjs from 'rxjs';
import { Photo } from '../../interfaces/photo.interface';
import { Post } from '../../interfaces/post.interface';
import { ImageUtilsService } from '../../shared/services/image-utils.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private postsService = inject(PostsService);
  private albumsService = inject(AlbumsService);
  private photosService = inject(PhotosService);
  public imageUtils = inject(ImageUtilsService);

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
      posts: this.postsService.getPosts({ _limit: 1 }),
      albums: this.albumsService.getAlbums({ _limit: 1 }),
      photos: this.photosService.getPhotos({ _limit: 1 })
    }).subscribe(data => {
      this.statistics = {
        posts: Number(data.posts.headers.get('x-total-count')) || 0,
        albums: Number(data.albums.headers.get('x-total-count')) || 0,
        photos: Number(data.photos.headers.get('x-total-count')) || 0
      };
    });
  }

  private loadRecentPhotos(): void {
    this.photosService.getPhotos({ _limit: 20 }).subscribe(response => {
      if (response.body) {
        this.recentPhotos = response.body.map(photo => ({
          ...photo,
          loading: true
        }));
      }
    });
  }

  private loadTopPosts(): void {
    this.postsService.getPosts({ _limit: 6 }).subscribe(response => {
      if (response.body) {
        this.topPosts = response.body.map(post => ({
          ...post,
          author: 'Bret'
        }));
      }
    });
  }
}
