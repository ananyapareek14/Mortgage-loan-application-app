import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IAmortizationRequest, IAmortizationSchedule } from '../../models/IAmortizationSchedule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AmortizationService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  calculateAmortization(request: IAmortizationRequest) : Observable<IAmortizationSchedule[]> {
    return this.http.post<IAmortizationSchedule[]>(`${this.apiUrl}/amortization/calculate`,request);
  }

  getAmortizationByLoanId(loanId: number): Observable<IAmortizationSchedule[]> {
    return this.http.get<IAmortizationSchedule[]>(`${this.apiUrl}/amortization/${loanId}`);
  }
}
