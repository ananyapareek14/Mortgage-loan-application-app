import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ILoan } from '../../models/ILoan';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLoans(): Observable<ILoan[]> {
    return this.http.get<ILoan[]>(`${this.apiUrl}/loans`);
  }

  createLoan(loan: ILoan): Observable<ILoan> {
    return this.http.post<ILoan>(`${this.apiUrl}/loans`, loan);
  }

  getLoanById(userLoanNumber: number): Observable<ILoan> {
    return this.http.get<ILoan>(`${this.apiUrl}/loans/${userLoanNumber}`);
  }
}
