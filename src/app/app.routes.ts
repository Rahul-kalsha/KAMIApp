import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'posts',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/posts/post-list/post-list.component')
          .then(m => m.PostListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/posts/post-detail/post-detail.component')
          .then(m => m.PostDetailComponent)
      }
    ]
  },
  {
    path: 'albums',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/albums/album-list/album-list.component')
          .then(m => m.AlbumListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/albums/album-detail/album-detail.component')
          .then(m => m.AlbumDetailComponent)
      }
    ]
  },
  {
    path: 'photos',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/photos/photo-list/photo-list.component')
          .then(m => m.PhotoListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/photos/photo-detail/photo-detail.component')
          .then(m => m.PhotoDetailComponent)
      }
    ]
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./components/users/users.component')
      .then(m => m.UsersComponent)
  }
];
