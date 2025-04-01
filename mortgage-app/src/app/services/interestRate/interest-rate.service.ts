import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { IInterestRate } from '../../models/IInterestRate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterestRateService {
  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getInterestRate() : Observable<IInterestRate[]> {
    return this.http.get<IInterestRate[]>(`${this.apiUrl}/interestrates`);
  }
}
