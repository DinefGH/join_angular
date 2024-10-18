import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubtaskService, Subtask } from './subtask.service';
import { environment } from 'src/environments/environment';

describe('SubtaskService', () => {
  let service: SubtaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubtaskService],
    });
    service = TestBed.inject(SubtaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all subtasks', () => {
    const mockSubtasks: Subtask[] = [
      { id: 1, text: 'Subtask 1', completed: false },
      { id: 2, text: 'Subtask 2', completed: true }
    ];

    service.getSubtasks().subscribe((subtasks) => {
      expect(subtasks.length).toBe(2);
      expect(subtasks).toEqual(mockSubtasks);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSubtasks);
  });

  it('should retrieve a subtask by ID', () => {
    const mockSubtask: Subtask = { id: 1, text: 'Subtask 1', completed: false };

    service.getSubtask(1).subscribe((subtask) => {
      expect(subtask).toEqual(mockSubtask);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSubtask);
  });

  it('should create a new subtask', () => {
    const newSubtask: Subtask = { text: 'New Subtask', completed: false };
    const createdSubtask: Subtask = { id: 3, ...newSubtask };

    service.createSubtask(newSubtask).subscribe((subtask) => {
      expect(subtask).toEqual(createdSubtask);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/`);
    expect(req.request.method).toBe('POST');
    req.flush(createdSubtask);
  });

  it('should update an existing subtask', () => {
    const updatedSubtask: Subtask = { id: 1, text: 'Updated Subtask', completed: true };

    service.updateSubtask(1, updatedSubtask).subscribe((subtask) => {
      expect(subtask).toEqual(updatedSubtask);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/1/`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSubtask);
  });

  it('should delete a subtask', () => {
    service.deleteSubtask(1).subscribe((response) => {
      expect(response).toBeUndefined(); // No content expected
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simulate empty response on successful deletion
  });

  it('should handle errors gracefully', () => {
    const errorMessage = 'Failed to load subtasks';

    service.getSubtasks().subscribe(
      () => fail('Expected error, but got success response'),
      (error) => {
        expect(error).toEqual(`Error Code: 500\nMessage: ${errorMessage}`);
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/`);
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
  });
});
