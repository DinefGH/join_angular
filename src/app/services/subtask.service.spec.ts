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
      { id: 2, text: 'Subtask 2', completed: true },
    ];

    service.getSubtasks().subscribe(subtasks => {
      expect(subtasks.length).toBe(2);
      expect(subtasks).toEqual(mockSubtasks);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSubtasks);
  });

  it('should create a new subtask', () => {
    const newSubtask: Subtask = { text: 'New Subtask', completed: false };
    const createdSubtask: Subtask = { id: 3, ...newSubtask };

    service.createSubtask(newSubtask).subscribe(subtask => {
      expect(subtask).toEqual(createdSubtask);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/`);
    expect(req.request.method).toBe('POST');
    req.flush(createdSubtask);
  });

  it('should update an existing subtask', () => {
    const updatedSubtask: Subtask = { id: 1, text: 'Updated Subtask', completed: true };

    service.updateSubtask(1, updatedSubtask).subscribe(subtask => {
      expect(subtask).toEqual(updatedSubtask);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/subtasks/1/`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSubtask);
  });
});
