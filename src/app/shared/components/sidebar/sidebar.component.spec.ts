import { ComponentFixture, TestBed} from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';


describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([
          { path: 'profile/:id', component: Component },
          { path: 'dashboard', component: Component },
          { path: 'posts', component: Component },
          { path: 'albums', component: Component },
          { path: 'photos', component: Component }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render logo and app title', () => {
    const logo = fixture.debugElement.query(By.css('.logo-icon'));
    const title = fixture.debugElement.query(By.css('h5'));
    const subtitle = fixture.debugElement.query(By.css('.text-muted'));

    expect(logo).toBeTruthy();
    expect(logo.attributes['src']).toBe('assets/images/logo.png');
    expect(title.nativeElement.textContent).toBe('Social Grid');
    expect(subtitle.nativeElement.textContent).toBe('Workspace');
  });

  it('should render all navigation links', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
    
    expect(navLinks.length).toBe(4);
    expect(navLinks[0].nativeElement.textContent).toContain('Dashboard');
    expect(navLinks[1].nativeElement.textContent).toContain('Posts');
    expect(navLinks[2].nativeElement.textContent).toContain('Albums');
    expect(navLinks[3].nativeElement.textContent).toContain('Photos');
  });

  it('should have correct router links', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
    
    expect(navLinks[0].attributes['routerLink']).toBe('/dashboard');
    expect(navLinks[1].attributes['routerLink']).toBe('/posts');
    expect(navLinks[2].attributes['routerLink']).toBe('/albums');
    expect(navLinks[3].attributes['routerLink']).toBe('/photos');
  });

  it('should render user profile section', () => {
    const profileCard = fixture.debugElement.query(By.css('.card'));
    const userAvatar = fixture.debugElement.query(By.css('.card img'));
    const userName = fixture.debugElement.query(By.css('.card h6'));
    const viewProfileLink = fixture.debugElement.query(By.css('.card a'));

    expect(profileCard).toBeTruthy();
    expect(userAvatar.attributes['src']).toBe('assets/images/user-avatar.jpg');
    expect(userName.nativeElement.textContent).toBe('User');
    expect(viewProfileLink.nativeElement.textContent).toBe('View Profile');
  });  

  it('should have correct icons for navigation items', () => {
    const icons = fixture.debugElement.queryAll(By.css('.nav-link i'));
    
    expect(icons[0].classes['bi-grid-1x2-fill']).toBeTrue();
    expect(icons[1].classes['bi-chat-square-text-fill']).toBeTrue();
    expect(icons[2].classes['bi-collection-fill']).toBeTrue();
    expect(icons[3].classes['bi-image-fill']).toBeTrue();
  });
});
