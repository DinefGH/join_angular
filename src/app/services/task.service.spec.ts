import { TestBed } from '@angular/core/testing';

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import thes
import { Task } from 'src/app/services/task.service'; // Adjust the path as necessary

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Ensure HttpClientTestingModule is imported
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should retrieve tasks from the API via GET', () => {
    const dummyTasks: Task[] = [
      {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        priority: 'High',
        due_date: '2024-09-01',
        category: 1,
        assigned_to: [1, 2],
        subtasks: [],
        status: 'todo',
        contacts: [1],
      },
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/tasks/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  it('should add a task via POST', () => {
    const newTask: Task = {
      title: 'New Task',
      priority: 'Medium',
      assigned_to: [1],
      subtasks: [],
      contacts: [1],
    };

    service.addTask(newTask).subscribe(task => {
      expect(task.title).toBe('New Task');
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/tasks/`);
    expect(req.request.method).toBe('POST');
    req.flush(newTask);
  });

  it('should update a task via PUT', () => {
    const updatedTask: Task = {
      id: 1,
      title: 'Updated Task',
      priority: 'Low',
      assigned_to: [1, 2],
      subtasks: [{ id: 1, text: 'Subtask 1', completed: false }],
      contacts: [1],
    };

    service.updateTask(1, updatedTask).subscribe(task => {
      expect(task.title).toBe('Updated Task');
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/tasks/1/`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTask);
  });

  it('should delete a task via DELETE', () => {
    service.deleteTask(1).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/tasks/1/`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
