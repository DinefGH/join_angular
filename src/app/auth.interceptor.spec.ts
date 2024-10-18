import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding requests remain
  });

  it('should add Authorization header when token exists in sessionStorage', () => {
    // Mock token in sessionStorage
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'auth_token') {
        return 'session-token';
      }
      return null;
    });

    // Send an HTTP request
    httpClient.get('/api/data').subscribe();

    // Expect one request to be made
    const req = httpMock.expectOne('/api/data');

    // Check if the Authorization header has been added
    expect(req.request.headers.get('Authorization')).toBe('Token session-token');
  });

  it('should add Authorization header when token exists in localStorage', () => {
    // Mock token in localStorage
    spyOn(sessionStorage, 'getItem').and.returnValue(null); // No session token
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'auth_token') {
        return 'local-token';
      }
      return null;
    });

    // Send an HTTP request
    httpClient.get('/api/data').subscribe();

    // Expect one request to be made
    const req = httpMock.expectOne('/api/data');

    // Check if the Authorization header has been added from localStorage
    expect(req.request.headers.get('Authorization')).toBe('Token local-token');
  });

  it('should not add Authorization header if URL is excluded', () => {
    // Exclude /signup/ and /login/ from having the Authorization header
    spyOn(sessionStorage, 'getItem').and.returnValue('session-token'); // Mock token

    // Send an HTTP request to the excluded URL
    httpClient.post('/signup/', {}).subscribe();

    // Expect one request to be made
    const req = httpMock.expectOne('/signup/');

    // Check that the Authorization header is NOT added
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should not add Authorization header if no token exists', () => {
    // No token available in either sessionStorage or localStorage
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // Send an HTTP request
    httpClient.get('/api/data').subscribe();

    // Expect one request to be made
    const req = httpMock.expectOne('/api/data');

    // Check that the Authorization header is NOT added
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should add Authorization header for non-excluded URLs when token exists', () => {
    // Mock token in sessionStorage
    spyOn(sessionStorage, 'getItem').and.returnValue('session-token');

    // Send an HTTP request to a non-excluded URL
    httpClient.get('/api/secure/data').subscribe();

    // Expect one request to be made
    const req = httpMock.expectOne('/api/secure/data');

    // Check that the Authorization header has been added
    expect(req.request.headers.get('Authorization')).toBe('Token session-token');
  });
});
