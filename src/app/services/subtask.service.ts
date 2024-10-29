import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// Define the Subtask model
export interface Subtask {
  id?: number; // Optional if not yet created
  text: string;
  completed: boolean;
}

// Define the service that handles API operations for Subtasks
@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  private apiUrl = `${environment.apiUrl}/subtasks/`;

  constructor(private http: HttpClient) {}

  getSubtasks(): Observable<Subtask[]> {
    return this.http.get<Subtask[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getSubtask(id: number): Observable<Subtask> {
    return this.http.get<Subtask>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createSubtask(subtask: Subtask): Observable<Subtask> {
    return this.http.post<Subtask>(this.apiUrl, subtask).pipe(
      catchError(error => {
        console.error('Error creating subtask:', error);
        return throwError(() => new Error('Error creating subtask'));
      }),
    );
  }

  updateSubtask(id: number, subtask: Subtask): Observable<Subtask> {
    const url = `${this.apiUrl.replace(/\/+$/, '')}/${id}/`; // Ensure trailing slash

    return this.http.put<Subtask>(url, subtask).pipe(catchError(this.handleError));
  }

  deleteSubtask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // You might use a remote logging infrastructure
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
