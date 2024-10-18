import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { HttpHeaders } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService],
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in successfully and store token in localStorage', () => {
    const mockResponse = { token: 'mock-token' };
    const email = 'john.doe@example.com';
    const password = 'password123';

    spyOn(localStorage, 'setItem').and.callThrough();
    spyOn(sessionStorage, 'setItem').and.callThrough();

    service.login(email, password).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-token');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('showOverlaySummary', 'true');
    });

    const req = httpMock.expectOne(service['loginUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });

    req.flush(mockResponse); // Respond with the mock response
  });

  it('should handle login errors gracefully', () => {
    const email = 'john.doe@example.com';
    const password = 'wrong-password';

    service.login(email, password).subscribe(response => {
      expect(response).toBeNull(); // Expect null on error
    });

    const req = httpMock.expectOne(service['loginUrl']);
    req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });
  });

  it('should log out and remove token from localStorage', () => {
    spyOn(localStorage, 'removeItem').and.callThrough();
    spyOn(sessionStorage, 'removeItem').and.callThrough();

    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('showOverlay');
  });

  it('should fetch protected data with authorization token', () => {
    const mockProtectedData = { data: 'protected data' };
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.getProtectedData().subscribe(data => {
      expect(data).toEqual(mockProtectedData);
    });

    const req = httpMock.expectOne(service['protectedUrl']);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Token mock-token');

    req.flush(mockProtectedData); // Respond with the mock data
  });

  it('should handle errors while fetching protected data', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.getProtectedData().subscribe(response => {
      expect(response).toBeNull(); // Expect null on error
    });

    const req = httpMock.expectOne(service['protectedUrl']);
    req.flush('Error fetching data', { status: 500, statusText: 'Server Error' });
  });

  it('should return true if user is logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    const isLoggedIn = service.isLoggedIn();
    expect(isLoggedIn).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const isLoggedIn = service.isLoggedIn();
    expect(isLoggedIn).toBeFalse();
  });
});
