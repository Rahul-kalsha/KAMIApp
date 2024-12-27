import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileHeaderComponent } from './mobile-header.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('MobileHeaderComponent', () => {
  let component: MobileHeaderComponent;
  let fixture: ComponentFixture<MobileHeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MobileHeaderComponent,
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileHeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit menuClick event when menu button is clicked', () => {
    const menuClickSpy = spyOn(component.menuClick, 'emit');
    const menuButton = fixture.debugElement.query(By.css('.btn-link'));
    
    menuButton.triggerEventHandler('click');
    
    expect(menuClickSpy).toHaveBeenCalled();
  });

  it('should call onMenuClick when menu button is clicked', () => {
    const onMenuClickSpy = spyOn(component, 'onMenuClick');
    const menuButton = fixture.debugElement.query(By.css('.btn-link'));
    
    menuButton.triggerEventHandler('click');
    
    expect(onMenuClickSpy).toHaveBeenCalled();
  });

  it('should render menu icon', () => {
    const menuIcon = fixture.debugElement.query(By.css('.bi-list'));
    expect(menuIcon).toBeTruthy();
  });

  it('should render logo image', () => {
    const logo = fixture.debugElement.query(By.css('.mobile-logo'));
    expect(logo).toBeTruthy();
    expect(logo.attributes['src']).toBe('assets/images/logo.png');
    expect(logo.attributes['alt']).toBe('Logo');
  });

  it('should render user avatar', () => {
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    expect(avatar).toBeTruthy();
    expect(avatar.attributes['src']).toBe('assets/images/user-avatar.jpg');
    expect(avatar.attributes['alt']).toBe('User');
  });

  it('should have correct router link for user avatar', () => {
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    expect(avatar.attributes['ng-reflect-router-link']).toBe('/profile,1');
  });

  it('should navigate to profile when user avatar is clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    
    avatar.nativeElement.click();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/profile', 1]);
  });

  it('should have correct CSS classes for mobile responsiveness', () => {
    const header = fixture.debugElement.query(By.css('.mobile-header'));
    expect(header.classes['d-lg-none']).toBeTrue();
  });

  it('should have correct styling classes for layout', () => {
    const header = fixture.debugElement.query(By.css('.mobile-header'));
    expect(header).toBeTruthy();
    
    // Check for essential layout classes
    expect(header.nativeElement.classList.contains('mobile-header')).toBeTrue();
    expect(header.nativeElement.classList.contains('d-lg-none')).toBeTrue();
  });

  it('should have accessible elements', () => {
    const menuButton = fixture.debugElement.query(By.css('.btn-link'));
    const logo = fixture.debugElement.query(By.css('.mobile-logo'));
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    
    expect(menuButton.attributes['role']).toBeDefined();
    expect(logo.attributes['alt']).toBe('Logo');
    expect(avatar.attributes['alt']).toBe('User');
  });

  it('should have correct image dimensions in styles', () => {
    const logo = fixture.debugElement.query(By.css('.mobile-logo'));
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    
    const logoStyles = window.getComputedStyle(logo.nativeElement);
    const avatarStyles = window.getComputedStyle(avatar.nativeElement);
    
    expect(logoStyles.height).toBe('35px');
    expect(logoStyles.width).toBe('35px');
    expect(avatarStyles.height).toBe('35px');
    expect(avatarStyles.width).toBe('35px');
  });

  it('should have cursor pointer on clickable elements', () => {
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    const avatarStyles = window.getComputedStyle(avatar.nativeElement);
    
    expect(avatarStyles.cursor).toBe('pointer');
  });

  it('should handle Enter key press on user avatar', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    
    // Simulate Enter key press with proper event object
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    });
    
    avatar.triggerEventHandler('keydown.enter', keyboardEvent);
    
    expect(navigateSpy).toHaveBeenCalledWith(['/profile', 1]);
  });

  it('should call onProfileClick when Enter key is pressed on avatar', () => {
    const onProfileClickSpy = spyOn(component, 'onProfileClick');
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    
    // Simulate Enter key press with proper event object
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    });
    
    avatar.triggerEventHandler('keydown.enter', keyboardEvent);
    
    expect(onProfileClickSpy).toHaveBeenCalled();
  });

  it('should have correct accessibility attributes on user avatar', () => {
    const avatar = fixture.debugElement.query(By.css('.mobile-user img'));
    
    expect(avatar.attributes['role']).toBe('button');
    expect(avatar.attributes['aria-label']).toBe('View profile');
    expect(avatar.attributes['tabindex']).toBe('0');
  });
});
