import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchComponent,
        ReactiveFormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search if no initial value', () => {
    expect(component.searchControl.value).toBe('');
  });

  it('should initialize with initial value when provided', () => {
    component.initialValue = 'test search';
    component.ngOnInit();
    expect(component.searchControl.value).toBe('test search');
  });

  it('should emit search event when value changes', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    component.searchControl.setValue('new search');
    tick(300); // Account for debounce time
    expect(searchSpy).toHaveBeenCalledWith('new search');
  }));
});
