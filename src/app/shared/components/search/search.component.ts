import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Input() searchPlaceholder = 'Search photo';
  @Output() search = new EventEmitter<string>();
  searchText = '';
  onSearch(value: string) {
    this.search.emit(value);
  }
}
