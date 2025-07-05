import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // standalone
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not attempt login if form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.login();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should login successfully with valid credentials', fakeAsync(() => {
    component.form.setValue({ email: 'test@example.com', password: 'password' });

    mockAuthService.login.and.returnValue(of({ access_token: 'mock-token' }));
    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(mockSnackBar.open).toHaveBeenCalledWith('Login successful', 'Close', { duration: 2500 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(component.loading).toBeFalse();
  }));

  it('should show error on failed login', fakeAsync(() => {
    component.form.setValue({ email: 'fail@example.com', password: 'wrong' });

    mockAuthService.login.and.returnValue(throwError(() => new Error('Invalid')));
    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(component.error).toBe('Invalid email or password');
    expect(mockSnackBar.open).toHaveBeenCalledWith('Login failed', 'Close', { duration: 3000 });
    expect(component.loading).toBeFalse();
  }));
});
