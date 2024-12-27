import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../interfaces/post.interface';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  posts: Post[] = [];
  loading = false;

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Load user details
    this.usersService.getUser(userId).subscribe({
      next: (data) => {
        this.user = data;
        // Load user's posts after user data is loaded
        this.loadUserPosts(userId);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.loading = false;
      }
    });
  }

  loadUserPosts(userId: number) {
    this.postsService.getPosts({userId: userId}).subscribe({
      next: (response) => {
        this.posts = response.body || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });
  }
}
