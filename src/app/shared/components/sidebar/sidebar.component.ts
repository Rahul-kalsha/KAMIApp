import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MobileHeaderComponent } from '../mobile-header/mobile-header.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterModule, MobileHeaderComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    isSidebarOpen = false;

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }
}
