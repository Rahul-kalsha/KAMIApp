import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';
import { By } from '@angular/platform-browser';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for inputs', () => {
    expect(component.message).toBeUndefined();
    expect(component.overlay).toBeFalse();
  });

  it('should render spinner with default configuration', () => {
    const spinnerWrapper = fixture.debugElement.query(By.css('.spinner-wrapper'));
    const spinnerBorder = fixture.debugElement.query(By.css('.spinner-border'));
    const messageElement = fixture.debugElement.query(By.css('.mt-2'));

    expect(spinnerWrapper).toBeTruthy();
    expect(spinnerWrapper.classes['overlay']).toBeFalsy();
    expect(spinnerBorder).toBeTruthy();
    expect(messageElement).toBeFalsy();
  });

  it('should show message when provided', () => {
    const testMessage = 'Loading data...';
    component.message = testMessage;
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.mt-2'));
    expect(messageElement).toBeTruthy();
    expect(messageElement.nativeElement.textContent).toBe(testMessage);
  });

  it('should add overlay class when overlay is true', () => {
    component.overlay = true;
    fixture.detectChanges();

    const spinnerWrapper = fixture.debugElement.query(By.css('.spinner-wrapper'));
    expect(spinnerWrapper.classes['overlay']).toBeTrue();
  });

  it('should have proper spinner structure', () => {
    const spinnerWrapper = fixture.debugElement.query(By.css('.spinner-wrapper'));
    const spinnerContainer = fixture.debugElement.query(By.css('.spinner-container'));
    const spinnerBorder = fixture.debugElement.query(By.css('.spinner-border'));
    const visuallyHidden = fixture.debugElement.query(By.css('.visually-hidden'));

    expect(spinnerWrapper).toBeTruthy();
    expect(spinnerContainer).toBeTruthy();
    expect(spinnerBorder).toBeTruthy();
    expect(spinnerBorder.attributes['role']).toBe('status');
    expect(visuallyHidden).toBeTruthy();
    expect(visuallyHidden.nativeElement.textContent).toBe('Loading...');
  });

  it('should update message when input changes', () => {
    const initialMessage = 'Initial loading...';
    const updatedMessage = 'Updated loading...';

    component.message = initialMessage;
    fixture.detectChanges();

    let messageElement = fixture.debugElement.query(By.css('.mt-2'));
    expect(messageElement.nativeElement.textContent).toBe(initialMessage);

    component.message = updatedMessage;
    fixture.detectChanges();

    messageElement = fixture.debugElement.query(By.css('.mt-2'));
    expect(messageElement.nativeElement.textContent).toBe(updatedMessage);
  });

  it('should toggle overlay class when overlay input changes', () => {
    const spinnerWrapper = fixture.debugElement.query(By.css('.spinner-wrapper'));
    
    expect(spinnerWrapper.classes['overlay']).toBeFalsy();

    component.overlay = true;
    fixture.detectChanges();
    expect(spinnerWrapper.classes['overlay']).toBeTrue();

    component.overlay = false;
    fixture.detectChanges();
    expect(spinnerWrapper.classes['overlay']).toBeFalsy();
  });
});
