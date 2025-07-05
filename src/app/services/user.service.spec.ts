import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

describe('UserService', () => {
  let service: UserService;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockPayload = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  };

  // Create a base64-encoded JWT with a payload only
  const createMockToken = (payload: any) => {
    const base64 = (obj: any) => btoa(JSON.stringify(obj));
    return `header.${base64(payload)}.signature`;
  };

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return email from token', () => {
    mockAuthService.getToken.and.returnValue(createMockToken(mockPayload));
    expect(service.getEmail()).toBe(mockPayload.email);
  });

  it('should return first name from token', () => {
    mockAuthService.getToken.and.returnValue(createMockToken(mockPayload));
    expect(service.getFirstName()).toBe(mockPayload.firstName);
  });

  it('should return last name from token', () => {
    mockAuthService.getToken.and.returnValue(createMockToken(mockPayload));
    expect(service.getLastName()).toBe(mockPayload.lastName);
  });

  it('should return full name from token', () => {
    mockAuthService.getToken.and.returnValue(createMockToken(mockPayload));
    expect(service.getFullName()).toBe('Test User');
  });

  it('should return empty string if token is missing', () => {
    mockAuthService.getToken.and.returnValue(null);

    expect(service.getEmail()).toBe('');
    expect(service.getFirstName()).toBe('');
    expect(service.getLastName()).toBe('');
    expect(service.getFullName()).toBe('');
  });
});
