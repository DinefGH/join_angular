import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


/**
 * Interface representing a subtask with optional ID, text, and completion status.
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
 * SubtaskService provides methods to create, retrieve, update, and delete subtasks.
 * It communicates with the server API and handles any HTTP errors that occur during requests.
 */
@Injectable({
  providedIn: 'root',
})
export class SubtaskService {

  /** Base URL for the subtasks API. */
  private apiUrl = `${environment.apiUrl}/subtasks/`;


  /**
   * Constructor to inject HttpClient for making HTTP requests.
   * @param http - HttpClient instance for handling HTTP requests.
   */
  constructor(private http: HttpClient) {}


    /**
   * Retrieves the list of all subtasks from the server.
   * @returns An Observable that emits an array of Subtask objects.
   */
  getSubtasks(): Observable<Subtask[]> {
    return this.http.get<Subtask[]>(this.apiUrl).pipe(catchError(this.handleError));
  }


  /**
   * Retrieves a specific subtask by ID.
   * @param id - The ID of the subtask to retrieve.
   * @returns An Observable that emits the requested Subtask.
   */
  getSubtask(id: number): Observable<Subtask> {
    return this.http.get<Subtask>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }


    /**
   * Creates a new subtask on the server.
   * @param subtask - The Subtask object to create.
   * @returns An Observable that emits the created Subtask.
   */
  createSubtask(subtask: Subtask): Observable<Subtask> {
    return this.http.post<Subtask>(this.apiUrl, subtask).pipe(
      catchError(error => {
        console.error('Error creating subtask:', error);
        return throwError(() => new Error('Error creating subtask'));
      }),
    );
  }


    /**
   * Updates an existing subtask by its ID.
   * @param id - The ID of the subtask to update.
   * @param subtask - The updated Subtask object.
   * @returns An Observable that emits the updated Subtask.
   */
  updateSubtask(id: number, subtask: Subtask): Observable<Subtask> {
    const url = `${this.apiUrl.replace(/\/+$/, '')}/${id}/`; // Ensure trailing slash

    return this.http.put<Subtask>(url, subtask).pipe(catchError(this.handleError));
  }


    /**
   * Deletes a subtask by its ID.
   * @param id - The ID of the subtask to delete.
   * @returns An Observable that completes when the subtask is deleted.
   */
  deleteSubtask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }


    /**
   * Handles HTTP errors that occur during requests, logging error details to the console.
   * @param error - The error response received.
   * @returns An Observable that emits an error message.
   */
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
