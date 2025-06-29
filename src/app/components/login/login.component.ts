import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    // Material modules
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private _fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private _snackbar = inject(MatSnackBar)

  error = '';
  loading = false;

  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor() {}

  login() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { email, password } = this.form.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this._snackbar.open('Login successful', 'Close', { duration: 2500 });
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Invalid email or password';
        this._snackbar.open('Login failed', 'Close', { duration: 3000 });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}