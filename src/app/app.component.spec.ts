import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core'; 

// Create a mock SidebarComponent to avoid loading the actual component
@Component({
  selector: 'app-sidebar',
  template: ''
})
class MockSidebarComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
      providers: [
        provideRouter([])
      ],
      declarations: [MockSidebarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'KAMIApp' title`, () => {
    expect(component.title).toEqual('KAMIApp');
  });

  it('should render sidebar component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
