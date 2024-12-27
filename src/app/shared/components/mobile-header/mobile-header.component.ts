import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss'
})
export class MobileHeaderComponent {
  @Output() menuClick = new EventEmitter<void>();

  constructor(private router: Router) {}

  onMenuClick(): void {
    this.menuClick.emit();
  }

  onProfileClick(): void {
    this.router.navigate(['/profile', 1]);
  }
}
