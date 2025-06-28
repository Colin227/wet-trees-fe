import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private router = inject(Router);
  private _snackbar = inject(MatSnackBar)
  error = '';
  loading = false;

    form = this._fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  register() {
    console.log("Clicked register")
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { email, password, firstName, lastName } = this.form.getRawValue();

    this._authService.register({ email, password, firstName, lastName }).subscribe({
      next: () => {
        this._snackbar.open('Account created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/login'])
      },
      error: () => {
        this.error = 'Failed to create account';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
  })
  }

  

}
