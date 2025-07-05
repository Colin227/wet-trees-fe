import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from 'environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockToken = 'mock-token';

  beforeEach(() => {

    // Mock localStorage
    const store: Record<string, string> = {};

    const mockLocalStorage = {
      getItem: (key: string): string | null => store[key] || null,
      setItem: (key: string, value: string) => store[key] = value,
      removeItem: (key: string) => delete store[key],
      clear: () => Object.keys(store).forEach(k => delete store[k]),
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });


    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make POST request to register user', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User'
    };

    service.register(userData).subscribe(response => {
      expect(response).toBeNull(); // Because it's void
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush(null); // Simulate void response
  });

  it('should login and store token in localStorage', () => {
    const credentials = { email: 'test@example.com', password: 'password' };

    service.login(credentials.email, credentials.password).subscribe(response => {
      expect(response.access_token).toEqual(mockToken);
      expect(localStorage.getItem(environment.tokenKey)).toEqual(mockToken);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush({ access_token: mockToken });
  });

  it('should return token from localStorage', () => {
    localStorage.setItem(environment.tokenKey, mockToken);
    expect(service.getToken()).toEqual(mockToken);
  });

  it('should remove token on logout', () => {
    localStorage.setItem(environment.tokenKey, mockToken);
    service.logout();
    expect(localStorage.getItem(environment.tokenKey)).toBeNull();
  });

  it('should return true if authenticated (token exists)', () => {
    localStorage.setItem(environment.tokenKey, mockToken);
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if not authenticated (no token)', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });
});
