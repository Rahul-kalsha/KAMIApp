import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostsService } from '../../../services/posts.service';
import { CommonModule, Location } from '@angular/common';
import { Post } from '../../../interfaces/post.interface';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, RouterModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadPost(id);
    });
  }

  loadPost(id: number) {
    this.loading = true;
    this.postsService.getPost(id).subscribe({
      next: (data) => {
        this.post = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
}