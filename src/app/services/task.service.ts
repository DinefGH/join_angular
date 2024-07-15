import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment'; // Import environment for dynamic API URLs

export interface Subtask {
  id?: number;
  text: string;
  completed: boolean;
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  priority: string;
  due_date?: string;
  category?: number;
  assigned_to: number[];
  subtasks: Subtask[];
  status?: string; // Add status field
  contacts: number[]; // Add this line
  creator?: number; // Add this line

  showStatusDropdown?: boolean;

}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = environment.apiUrl; // Use environment to manage API URL

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error); // A client-side or network error occurred.
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error); // The backend returned an unsuccessful response code.
    }
    return throwError('Something bad happened; please try again later.'); // Return an observable with a user-facing error message.
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/`)
      .pipe(
        retry(3), // Retry this request up to three times.
        catchError(this.handleError) // Handle errors
      );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}/`)
      .pipe(catchError(this.handleError));
  }

  addTask(task: Task): Observable<Task> {
    task.status = 'todo'; // Ensure the status is set to 'todo'
    return this.http.post<Task>(`${this.baseUrl}/tasks/`, task)
      .pipe(catchError(this.handleError));
  }



  updateTask(id: number, task: Task): Observable<Task> {
    console.log('Initial task data:', task);  // Debug log
  
    // Ensure no duplicate subtasks are sent to the backend
    const uniqueSubtasks = task.subtasks.filter((subtask, index, self) =>
      index === self.findIndex((t) => (
        t.id === subtask.id && t.text === subtask.text
      ))
    );
  
    const updatedTask = { ...task, subtasks: uniqueSubtasks };
    
    console.log('Unique subtasks:', uniqueSubtasks);  // Debug log
    console.log('Updated task data being sent to backend:', updatedTask);  // Debug log
  
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}/`, updatedTask)
      .pipe(
        catchError(this.handleError)
      );
  }

  

  deleteTask(id: number): Observable<{}> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}/`)
      .pipe(catchError(this.handleError));
  }
}