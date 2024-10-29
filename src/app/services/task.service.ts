import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


/**
 * Interface representing a subtask, with optional ID, text description, and completion status.
 */
export interface Subtask {

  /** Unique identifier for the subtask. */
  id?: number;

/** Text description of the subtask. */
  text: string;

  /** Boolean indicating if the subtask is completed. */
  completed: boolean;
}


/**
 * Interface representing a task, with optional ID, title, priority, due date, category, and more.
 * Includes subtasks and contacts associated with the task.
 */
export interface Task {

  /** Unique identifier for the task. */
  id?: number;

  /** Title of the task. */
  title: string;

  /** Optional description of the task. */
  description?: string;

  /** Priority level of the task (e.g., high, medium, low). */
  priority: string;

  /** Optional due date for the task, represented as a string. */
  due_date?: string;

  /** Optional ID of the category associated with the task. */
  category?: number;

  /** Array of user IDs assigned to the task. */
  assigned_to: number[];

  /** Array of subtasks associated with the task. */
  subtasks: Subtask[];

  /** Optional status of the task (e.g., todo, in progress, done). */
  status?: string; 

  /** Array of contact IDs associated with the task. */
  contacts: number[]; 

  /** Optional ID of the user who created the task. */
  creator?: number; 

  /** Optional boolean to toggle the visibility of the status dropdown. */
  showStatusDropdown?: boolean;
}


/**
 * TaskService manages tasks by providing methods to create, retrieve, update, and delete tasks.
 * It also includes error handling for HTTP requests.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {

  /** Base URL for task-related API endpoints. */
  private baseUrl = environment.apiUrl; 


    /**
   * Constructor to inject HttpClient for making HTTP requests.
   * @param http - HttpClient instance for sending requests to the server.
   */
  constructor(private http: HttpClient) {}


    /**
   * Handles errors from HTTP requests, logging the error and providing a generic error message.
   * @param error - The error response from the HTTP request.
   * @returns An observable that emits an error message.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error); 
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error); 
    }
    return throwError('Something bad happened; please try again later.'); 
  }


    /**
   * Retrieves all tasks from the server.
   * @returns An Observable that emits an array of Task objects.
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/`).pipe(
      retry(3), 
      catchError(this.handleError), 
    );
  }


    /**
   * Retrieves a specific task by its ID.
   * @param id - The ID of the task to retrieve.
   * @returns An Observable that emits the requested Task object.
   */
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}/`).pipe(catchError(this.handleError));
  }


    /**
   * Adds a new task with a default status of 'todo'.
   * @param task - The Task object to be added.
   * @returns An Observable that emits the created Task object.
   */
  addTask(task: Task): Observable<Task> {
    task.status = 'todo'; 
    return this.http.post<Task>(`${this.baseUrl}/tasks/`, task).pipe(catchError(this.handleError));
  }


    /**
   * Updates an existing task by its ID, ensuring unique subtasks.
   * @param id - The ID of the task to update.
   * @param task - The updated Task object.
   * @returns An Observable that emits the updated Task object.
   */
  updateTask(id: number, task: Task): Observable<Task> {
    const uniqueSubtasks = task.subtasks.filter(
      (subtask, index, self) =>
        index === self.findIndex(t => t.id === subtask.id && t.text === subtask.text),
    );

    const updatedTask = { ...task, subtasks: uniqueSubtasks };

    return this.http
      .put<Task>(`${this.baseUrl}/tasks/${id}/`, updatedTask)
      .pipe(catchError(this.handleError));
  }


    /**
   * Deletes a task by its ID.
   * @param id - The ID of the task to delete.
   * @returns An Observable that completes when the task is deleted.
   */
  deleteTask(id: number): Observable<{}> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}/`).pipe(catchError(this.handleError));
  }
}
