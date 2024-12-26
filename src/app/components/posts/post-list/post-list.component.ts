import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../../interfaces/post.interface';
import { PostsService } from '../../../services/posts.service';
import { SortComponent } from '../../../shared/components/sort/sort.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, SortComponent, NgbPaginationModule, RouterModule, SpinnerComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  currentPage = 1;
  itemsPerPage = 9; // Show 9 items per page to match 3x3 grid
  loading = false;
  
  sortOptions = [
    { label: 'Title (A-Z)', value: 'title_asc' },
    { label: 'Title (Z-A)', value: 'title_desc' },
    { label: 'Author (A-Z)', value: 'author_asc' },
    { label: 'Author (Z-A)', value: 'author_desc' }
  ];

  constructor(private postsService: PostsService, private router: Router) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.map((post: Post) => ({
          ...post,
          author: `User${post.userId}`
        }));
        this.filteredPosts = [...this.posts];
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });
  }

  onSearch(searchText: string) {
    this.currentPage = 1;
    this.filteredPosts = this.posts.filter(post => 
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.body.toLowerCase().includes(searchText.toLowerCase()) ||
      post.id?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  }

  onSort(sortBy: string) {
    this.currentPage = 1;
    switch(sortBy) {
      case 'title_asc':
        this.filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        this.filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'author_asc':
        this.filteredPosts.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
        break;
      case 'author_desc':
        this.filteredPosts.sort((a, b) => (b.author || '').localeCompare(a.author || ''));
        break;
    }
  }

  get paginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPosts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPostClick(postId: number) {
    this.router.navigate(['/posts', postId]);
  }
  onUserClick(userId: number) {
    this.router.navigate(['/profile', userId]);
  }
}
