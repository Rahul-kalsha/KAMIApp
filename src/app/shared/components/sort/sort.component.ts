import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [FormsModule, NgbDropdownModule, CommonModule],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss'
})
export class SortComponent {
  @Input() sortOptions: {label: string, value: string}[] = [];
  @Output() sort = new EventEmitter<string>();
  selectedSortLabel = '';
  onSortSelect(option: {label: string, value: string}) {
    this.selectedSortLabel = option.label;
    this.sort.emit(option.value);
  }
}
