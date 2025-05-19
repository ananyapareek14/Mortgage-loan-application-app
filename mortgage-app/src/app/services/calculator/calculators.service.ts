import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAffordability, IAffordabilityRequest } from '../../models/IAffordability';
import { IDebtToIncome, IDebtToIncomeRequest } from '../../models/IDebt-to-income';
import { IRefinance, IRefinanceRequest } from '../../models/IRefinance';
import { IVaMortgage, IVaMortgageRequest } from '../../models/IVaMortgage';
import { environment } from '../../environment/environment';
import { IAmortizationRequest, IAmortizationSchedule } from '../../models/IAmortizationSchedule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  calculateAmortization(
    request: IAmortizationRequest
  ): Observable<IAmortizationSchedule[]> {
    return this.http.post<IAmortizationSchedule[]>(
      `${this.apiUrl}/amortization/calculate`,
      request
    );
  }

  calculateAffordability(payload: IAffordabilityRequest) {
    return this.http.post<IAffordability>(
      `${this.apiUrl}/affordability/calculate`,
      payload
    );
  }

  calculateDti(payload: IDebtToIncomeRequest) {
    return this.http.post<IDebtToIncome>(
      `${this.apiUrl}/debt-to-income/calculate`,
      payload
    );
  }

  calculateRefinance(payload: IRefinanceRequest) {
    return this.http.post<IRefinance>(
      `${this.apiUrl}/refinance/calculate`,
      payload
    );
  }

  calculateVaMortgage(payload: IVaMortgageRequest) {
    return this.http.post<IVaMortgage[]>(
      `${this.apiUrl}/va-mortgage-schedule/calculate`,
      payload
    );
  }
}
