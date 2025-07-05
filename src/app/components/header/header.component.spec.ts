import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'logout']);
    const userSpy = jasmine.createSpyObj('UserService', ['getEmail', 'getFirstName', 'getLastName']);

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        RouterTestingModule
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
        { provide: UserService, useValue: userSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);

    // Set return values for spies
    authService.isAuthenticated.and.returnValue(true);
    userService.getEmail.and.returnValue('user@example.com');
    userService.getFirstName.and.returnValue('John');
    userService.getLastName.and.returnValue('Doe');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return user email and name from UserService', () => {
    expect(component.getEmail()).toBe('user@example.com');
    expect(component.getFirstName()).toBe('John');
    expect(component.getLastName()).toBe('Doe');
  });

  it('should call AuthService.logout and navigate on logout', () => {
    spyOn(router, 'navigate');
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call isAuthenticated', () => {
    component.isAuthenticated();
    expect(authService.isAuthenticated).toHaveBeenCalled();
  });
});
