import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Provides the HttpClient testing module
        RouterTestingModule.withRoutes([]), // Mocks the router for navigation tests
      ],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }, // Provide the interceptor
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);

    spyOn(router, 'navigateByUrl'); // Spy on router navigation
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should add Authorization header if token exists in localStorage', () => {
    // Simulate the token in localStorage
    localStorage.setItem('token', 'mock-token');

    // Make an HTTP request
    httpClient.get('/test').subscribe();

    // Expect a request to be made
    const req = httpMock.expectOne('/test');

    // Check that the Authorization header was added
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Token mock-token');

    req.flush({}); // Respond with an empty response
  });

  it('should not add Authorization header if no token is in localStorage', () => {
    // Ensure no token is in localStorage
    localStorage.removeItem('token');

    // Make an HTTP request
    httpClient.get('/test').subscribe();

    // Expect a request to be made
    const req = httpMock.expectOne('/test');

    // Check that the Authorization header was not added
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({}); // Respond with an empty response
  });

  it('should navigate to login on 401 Unauthorized error', () => {
    // Simulate the token in localStorage
    localStorage.setItem('token', 'mock-token');

    // Make an HTTP request
    httpClient.get('/test').subscribe({
      error: () => {
        // Handle error in subscription (not necessary for this test)
      },
    });

    // Expect a request to be made
    const req = httpMock.expectOne('/test');

    // Simulate a 401 Unauthorized error
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    // Expect the router to navigate to the login page
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should throw an error if another error occurs', () => {
    // Simulate the token in localStorage
    localStorage.setItem('token', 'mock-token');

    // Make an HTTP request
    httpClient.get('/test').subscribe({
      error: error => {
        // Assert that the error is thrown
        expect(error.status).toBe(500);
      },
    });

    // Expect a request to be made
    const req = httpMock.expectOne('/test');

    // Simulate a 500 Internal Server Error
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });
});
