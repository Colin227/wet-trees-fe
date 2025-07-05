import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call register if form is invalid', () => {
    component.form.patchValue({ email: '', password: '' }); // invalid
    component.register();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should call AuthService.register and navigate on success', fakeAsync(() => {
    const mockFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    component.form.setValue(mockFormData);
    mockAuthService.register.and.returnValue(of(void 0));

    component.register();
    tick();

    expect(mockAuthService.register).toHaveBeenCalledWith(mockFormData);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Account created successfully', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should set error message and stop loading on failure', fakeAsync(() => {
    const mockFormData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password'
    };

    component.form.setValue(mockFormData);
    mockAuthService.register.and.returnValue(throwError(() => new Error('Registration failed')));

    component.register();
    tick();

    expect(component.error).toBe('Failed to create account');
    expect(component.loading).toBeFalse();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockSnackBar.open).not.toHaveBeenCalledWith('Account created successfully', 'Close', { duration: 3000 });
  }));
});
