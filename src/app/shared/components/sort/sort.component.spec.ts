import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortComponent } from './sort.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

describe('SortComponent', () => {
  let component: SortComponent;
  let fixture: ComponentFixture<SortComponent>;

  const mockSortOptions = [
    { label: 'Title (A-Z)', value: 'title_asc' },
    { label: 'Title (Z-A)', value: 'title_desc' },
    { label: 'User Id (A-Z)', value: 'userId_asc' },
    { label: 'User Id (Z-A)', value: 'userId_desc' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbDropdownModule, SortComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortComponent);
    component = fixture.componentInstance;
    component.sortOptions = mockSortOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty selection if no initial value', () => {
    expect(component.selectedSortLabel).toBe('');
  });

  it('should initialize with initial value and correct label when provided', () => {
    component.initialValue = 'title_desc';
    component.ngOnInit();
    expect(component.selectedSortLabel).toBe('Title (Z-A)');
  });

  it('should not set label if initial value does not match any option', () => {
    component.initialValue = 'invalid_sort';
    component.ngOnInit();
    expect(component.selectedSortLabel).toBe('');
  });

  it('should emit sort event and update label when option is selected', () => {
    const sortSpy = spyOn(component.sort, 'emit');
    const option = mockSortOptions[0];
    
    component.onSortSelect(option);
    
    expect(sortSpy).toHaveBeenCalledWith(option.value);
    expect(component.selectedSortLabel).toBe(option.label);
  });

  it('should display "Sort By" when no option is selected', () => {
    const buttonText = fixture.nativeElement.querySelector('button')?.textContent?.trim();
    expect(buttonText).toBe('Sort By');
  });

  it('should display selected option label when option is selected', () => {
    const option = mockSortOptions[0];
    component.onSortSelect(option);
    fixture.detectChanges();
    
    const buttonText = fixture.nativeElement.querySelector('button')?.textContent?.trim();
    expect(buttonText).toBe(option.label);
  });

  it('should render all sort options in dropdown', () => {
    const dropdownItems = fixture.nativeElement.querySelectorAll('.dropdown-item');
    expect(dropdownItems.length).toBe(mockSortOptions.length);
    
    dropdownItems.forEach((item: Element, index: number) => {
      const itemText = item.textContent?.trim();
      expect(itemText).toBe(mockSortOptions[index].label);
    });
  });

  it('should handle click events on dropdown items', () => {
    const sortSpy = spyOn(component.sort, 'emit');
    const dropdownItems = fixture.nativeElement.querySelectorAll('.dropdown-item');
    
    dropdownItems[0].click();
    
    expect(sortSpy).toHaveBeenCalledWith(mockSortOptions[0].value);
    expect(component.selectedSortLabel).toBe(mockSortOptions[0].label);
  });

  it('should preserve selected label after multiple selections', () => {
    // Select first option
    component.onSortSelect(mockSortOptions[0]);
    expect(component.selectedSortLabel).toBe(mockSortOptions[0].label);

    // Select second option
    component.onSortSelect(mockSortOptions[1]);
    expect(component.selectedSortLabel).toBe(mockSortOptions[1].label);
  });
});
