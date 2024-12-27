import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [FormsModule, NgbDropdownModule, CommonModule],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss'
})
export class SortComponent implements OnInit {
  @Input() sortOptions: {label: string, value: string}[] = [];
  @Input() initialValue = '';
  @Output() sort = new EventEmitter<string>();
  selectedSortLabel = '';

  ngOnInit() {
    if (this.initialValue) {
      const selectedOption = this.sortOptions.find(option => option.value === this.initialValue);
      if (selectedOption) {
        this.selectedSortLabel = selectedOption.label;
      }
    }
  }

  onSortSelect(option: {label: string, value: string}) {
    this.selectedSortLabel = option.label;
    this.sort.emit(option.value);
  }
}
