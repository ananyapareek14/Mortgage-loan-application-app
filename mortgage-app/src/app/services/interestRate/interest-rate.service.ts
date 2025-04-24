import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { IInterestRate } from '../../models/IInterestRate';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InterestRateService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInterestRate(): Observable<IInterestRate[]> {
    return this.http.get<IInterestRate[]>(`${this.apiUrl}/interestrates`).pipe(
      map((data: IInterestRate[]) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid data structure');
        }

        const isValid = data.every(
          (rate: IInterestRate) =>
            typeof rate.Id === 'string' &&
            typeof rate.Rate === 'number' &&
            typeof rate.ValidFrom === 'string'
        );

        if (!isValid) {
          throw new Error('Invalid interest rate data');
        }

        return data as IInterestRate[];
      }),
      catchError((error: HttpErrorResponse) => {
        const isNetworkError =
          error.status === 0 &&
          (error.error instanceof ProgressEvent ||
            error.error instanceof ErrorEvent ||
            typeof error.error === 'string');

        if (isNetworkError) {
          return throwError(() => new Error('Network error'));
        }

        return throwError(() => new Error(error.message || 'Unknown error'));
      })
    );
  }
}