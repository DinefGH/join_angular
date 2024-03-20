import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface LoginResponse {
  token: string;
  // Add any other properties you expect from the login response
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public loginWithEmailAndPassword(username: string, password: string): Promise<LoginResponse> {
    const url = `${environment.baseUrl}/login/`;
    const body = { username, password };

    return lastValueFrom(this.http.post<LoginResponse>(url, body));
  }
}
