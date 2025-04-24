import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ILoan } from '../models/ILoan';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';
import { selectSelectedLoan } from '../store/loan/loan.selectors';
import { selectAmortizationSchedule } from '../store/amortization/amortization.selectors';
import { loadLoanById } from '../store/loan/loan.actions';
import { loadAmortizationSchedule } from '../store/amortization/amortization.actions';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PieChartComponent } from './pie-chart.component';
import { BarChartComponent } from './bar-chart.component';
import { LineChartComponent } from './line-chart.component';
import { chartSlideAnimation, slideIn, slideOut, staggerList } from '../../animations';


@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [PieChartComponent,BarChartComponent,LineChartComponent,CurrencyPipe, DatePipe, CommonModule],
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css'],
  animations: [slideIn, slideOut, staggerList, chartSlideAnimation],
})
export class LoanDetailsComponent implements OnInit {
  loan$: Observable<ILoan | null>;
  amortizationSchedule$: Observable<IAmortizationSchedule[] | null>;
  // totalInterest: number = 0;
  // totalPayment: number = 0;
  // monthlyPayment: number = 0;
  // activeTab: string = 'line-chart';
  
  totalInterest = 0;
  totalPayment = 0;
  monthlyPayment = 0;
  activeTab = 'line-chart';
  
  constructor(private store: Store, private route: ActivatedRoute) {
    this.loan$ = this.store.select(selectSelectedLoan);
    this.amortizationSchedule$ = this.store.select(selectAmortizationSchedule);
  }

  ngOnInit() {
    const userLoanNumber = Number(this.route.snapshot.paramMap.get('id'));
    if (userLoanNumber) {
      this.store.dispatch(loadLoanById({ userLoanNumber }));
      this.store.dispatch(loadAmortizationSchedule({ userLoanNumber }));
      this.amortizationSchedule$.subscribe((schedule) => {
        if (schedule) {
          this.calculateSummary(schedule);
        }
      });
    }
  }

  private calculateSummary(schedule: IAmortizationSchedule[]): void {
    this.totalInterest = schedule.reduce(
      (sum, p) => sum + p.InterestPayment,
      0
    );
    this.totalPayment = schedule.reduce((sum, p) => sum + p.MonthlyPayment, 0);
    this.monthlyPayment = schedule[0]?.MonthlyPayment || 0;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
