import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService, Category } from './category.service';
import { environment } from 'src/environments/environment';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Mock HttpClient
      providers: [CategoryService], // Provide the service
    });

    service = TestBed.inject(CategoryService); // Inject the CategoryService
    httpMock = TestBed.inject(HttpTestingController); // Inject HttpTestingController to control HTTP requests
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verify that the service is created
  });

  it('should fetch categories successfully', () => {
    const mockCategories: Category[] = [
      { id: 1, name: 'Work', color: '#FF0000' },
      { id: 2, name: 'Personal', color: '#00FF00' },
    ];

    // Call the getCategories method
    service.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(2); // Verify that two categories are returned
      expect(categories).toEqual(mockCategories); // Verify that the returned categories match the mock data
    });

    // Expect a single GET request to the correct API URL
    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);
    expect(req.request.method).toBe('GET'); // Ensure that the request is a GET request

    // Respond with mock categories
    req.flush(mockCategories);
  });

  it('should handle errors when fetching categories', () => {
    const mockErrorMessage = 'Failed to load categories';

    // Call the getCategories method and handle the error
    service.getCategories().subscribe(
      () => fail('Expected an error, but got a response'),
      (error) => {
        expect(error).toBeTruthy(); // Verify that an error is returned
      }
    );

    // Expect a single GET request to the correct API URL
    const req = httpMock.expectOne(`${environment.apiUrl}/categories`);

    // Simulate a network error by flushing with an error status
    req.flush(mockErrorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
});
