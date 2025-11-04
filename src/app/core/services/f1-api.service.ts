import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface Session {
  session_key: number;
  meeting_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  country_name: string;
  country_code: string;
  country_key: number;
  circuit_short_name: string;
}

export interface Driver {
  driver_number: number;
  name_acronym: string;
  full_name: string;
  country_code: string;
  team_name: string;
  headshot_url: string;
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

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.baseUrl}/drivers?session_key=latest`);
  }

  getEndpoint<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }
}
