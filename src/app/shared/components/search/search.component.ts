import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  @Input() searchPlaceholder = '';
  @Input() initialValue = '';
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');

  ngOnInit() {
    // Set initial value from URL
    if (this.initialValue) {
      this.searchControl.setValue(this.initialValue, { emitEvent: false });
    }

    // Subscribe to value changes
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      // Emit empty string when value is null, undefined, or empty string
      this.search.emit(value?.trim() ?? '');
    });
  }
}
