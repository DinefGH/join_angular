import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserRegistrationService } from './auth.service'; // Adjust the path as necessary

describe('UserRegistrationService', () => {
  let service: UserRegistrationService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Mock HttpClient module
      providers: [UserRegistrationService], // Provide the service
    });

    service = TestBed.inject(UserRegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Ensure the service is created
  });

  it('should send POST request to register a user', () => {
    const mockUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    // Call the registerUser method
    service.registerUser(mockUserData).subscribe(response => {
      expect(response).toBeTruthy(); // Expect a truthy response (can be any mocked response)
    });

    // Expect a POST request to the correct URL
    const req = httpMock.expectOne(service['registrationUrl']);
    expect(req.request.method).toBe('POST'); // Verify POST method
    expect(req.request.headers.get('Content-Type')).toBe('application/json'); // Verify headers
    expect(req.request.body).toEqual(mockUserData); // Ensure the correct data is sent in the request

    // Simulate a response
    req.flush({ success: true });
  });

  it('should handle error response correctly', () => {
    const mockUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    // Call the registerUser method
    service.registerUser(mockUserData).subscribe(
      () => fail('Should have failed with a 500 error'), // This should not be called
      (error: HttpErrorResponse) => {
        // Handle the error case
        expect(error.status).toBe(500);
        expect(error.error).toBe('Server error'); // Mock server error message
      },
    );

    // Expect a POST request to the correct URL
    const req = httpMock.expectOne(service['registrationUrl']);
    expect(req.request.method).toBe('POST');

    // Simulate a 500 server error
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
