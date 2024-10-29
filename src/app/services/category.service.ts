import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


/**
 * Represents a Category with its ID, name, and associated color.
 */
export interface Category {

  /** Unique identifier for the category. */
  id: number;

  /** Name of the category. */
  name: string;

  /** Color associated with the category, represented as a string. */
  color: string;
}


/**
 * CategoryService handles retrieval of categories from the server,
 * providing an observable that emits the list of categories.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService {

    /** API URL for accessing category data. */
  private apiUrl = `${environment.apiUrl}/categories`;


    /**
   * Constructor to inject HttpClient for making HTTP requests.
   * @param http - HttpClient instance for sending requests to the API.
   */
  constructor(private http: HttpClient) {}


    /**
   * Retrieves the list of categories from the server.
   * @returns An Observable that emits an array of Category objects.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}
