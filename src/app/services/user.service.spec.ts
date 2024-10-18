import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/assets/models/user.model';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    // other properties of the User model
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with user from localStorage if available', () => {
    const mockStoredUser = JSON.stringify(mockUser);
    spyOn(localStorage, 'getItem').and.returnValue(mockStoredUser);

    const serviceWithStoredUser = new UserService(TestBed.inject(HttpClient));
    serviceWithStoredUser.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser); // Verify that the user from localStorage is set in BehaviorSubject
    });
  });

  it('should fetch user details successfully', () => {
    // Mock the token in localStorage or sessionStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'auth_token') {
        return 'mock-token';
      }
      return null;
    });

    service.fetchCurrentUser().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    // Expect a GET request to the correct URL with Authorization header
    const req = httpMock.expectOne(service['userDetailsUrl']);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Token mock-token');

    // Respond with mock user data
    req.flush(mockUser);
  });

  it('should handle error while fetching user details', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');

    service.fetchCurrentUser().subscribe((user) => {
      expect(user).toBeNull(); // Expect null when there's an error
    });

    const req = httpMock.expectOne(service['userDetailsUrl']);
    req.flush('Error fetching user', { status: 500, statusText: 'Server Error' });
  });

  it('should store user in localStorage when set', () => {
    const mockSetItem = spyOn(localStorage, 'setItem');

    service.setCurrentUser(mockUser);

    expect(mockSetItem).toHaveBeenCalledWith('user_details', JSON.stringify(mockUser));

    service.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser); // Ensure the BehaviorSubject has been updated
    });
  });

  it('should clear user from BehaviorSubject when set to null', () => {
    const mockRemoveItem = spyOn(localStorage, 'removeItem');

    service.setCurrentUser(null);

    service.getCurrentUser().subscribe(user => {
      expect(user).toBeNull(); // Ensure the BehaviorSubject is updated to null
    });

    expect(mockRemoveItem).toHaveBeenCalledWith('user_details');
  });
});
