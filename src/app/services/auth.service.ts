import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http: HttpClient;
  private tokenKey = `${environment.tokenKey}`;

  constructor(private _http: HttpClient) {
    this.http = _http;
  }

  register(data: {email: string, password: string, firstName: string, lastName: string}) {
    return this.http.post<void>(`${environment.baseUrl}/users`, data);
  }

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${environment.baseUrl}/auth/login`, { email, password }).pipe(
      tap(response => localStorage.setItem(this.tokenKey, response.access_token))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}
