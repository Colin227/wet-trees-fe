import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _authService = inject(AuthService);
  constructor() { }

  getEmail(): string {
    const token = this._authService.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email;
  }

  getFirstName(): string {
    const token = this._authService.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.firstName;
  }

  getLastName(): string {
    const token = this._authService.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.lastName;
  }

  getFullName(): string {
    const token = this._authService.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.firstName + " " + payload.lastName;

  }
}
