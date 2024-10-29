import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Define the Category model directly within the service
export interface Category {
  id: number;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`; // Adjust if your API URL is different

  constructor(private http: HttpClient) {}

  // Fetch categories from the backend
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}
