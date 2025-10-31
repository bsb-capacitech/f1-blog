import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Session {
  session_key: number;
  meeting_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
}

@Injectable({ providedIn: 'root' })
export class F1ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://api.openf1.org/v1';

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/sessions`).pipe(
      catchError(err => {
        console.error('Erro ao buscar sessões: ', err);
        return throwError(() => err);
      })
    )
  }

  getDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/drivers`);
  }

  getEndpoint<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }
}
