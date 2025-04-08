import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter, Observable, Subscription } from 'rxjs';
import { IAmortizationRequest, IAmortizationSchedule } from '../models/IAmortizationSchedule';
import { Store } from '@ngrx/store';
import { selectAmortizationSchedule } from '../store/amortization/amortization.selectors';
import { calculateAmortization, resetAmortization } from '../store/amortization/amortization.actions';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { slideIn, slideOut, staggerList } from '../../animations';

@Component({
  selector: 'app-amortization',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CurrencyPipe],
  templateUrl: './amortization.component.html',
  styleUrl: './amortization.component.css',
  animations: [slideIn, slideOut, staggerList],
})
export class AmortizationComponent implements OnInit, OnDestroy {
  amortizationForm!: FormGroup;
  amortizationSchedule$!: Observable<IAmortizationSchedule[]>;
  totalInterest: number = 0;
  totalPayment: number = 0;
  monthlyPayment: number = 0;
  chart!: Chart;
  scheduleSubscription!: Subscription;
  currentPage = 1;
  itemsPerPage = 12;
  paginatedSchedule: IAmortizationSchedule[] = [];

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {}

  ngOnInit(): void {
    Chart.register(...registerables);

    // Initialize form with default values
    this.amortizationForm = this.fb.group({
      LoanAmount: [500000, []],
      InterestRate: [7.5, []],
      LoanTermYears: [5, []],
    });

    // Fetch amortization schedule from store
    this.amortizationSchedule$ = this.store.select(selectAmortizationSchedule).pipe(
      filter((schedule) => schedule !== null)
    );

    // Subscribe to schedule and calculate summary when it updates
    this.scheduleSubscription = this.amortizationSchedule$.subscribe((schedule) => {
      if (schedule.length > 0) {
        this.calculateSummary(schedule);
        this.renderChart();
      }
    });

    // Load amortization schedule on initialization
    this.loadDefaultAmortization();

    this.scheduleSubscription = this.amortizationSchedule$.subscribe((schedule) => {
      if (schedule.length > 0) {
        this.calculateSummary(schedule);
        this.renderChart();
      }
    });
  }

  submitForm(): void {
    if (this.amortizationForm.valid) {
      const request: IAmortizationRequest = this.amortizationForm.value;
      this.store.dispatch(calculateAmortization({ request }));
    }
  }

  private calculateSummary(schedule: IAmortizationSchedule[]): void {
    this.totalInterest = schedule.reduce((sum, p) => sum + p.InterestPayment, 0);
    this.totalPayment = schedule.reduce((sum, p) => sum + p.MonthlyPayment, 0);
    this.monthlyPayment = schedule[0]?.MonthlyPayment || 0;
  }

  private renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [
          {
            data: [this.amortizationForm.value.LoanAmount, this.totalInterest],
            backgroundColor: ['#4CAF50', '#FF5733'],
          },
        ],
      },
    });
  }

  private loadDefaultAmortization(): void {
    const request: IAmortizationRequest = {
      LoanAmount: 500000,
      InterestRate: 7.5,
      LoanTermYears: 5,
    };
    this.store.dispatch(calculateAmortization({ request }));
  }

  ngOnDestroy(): void {
    // Unsubscribe from schedule observable to prevent memory leaks
    if (this.scheduleSubscription) {
      this.scheduleSubscription.unsubscribe();
    }

    // Reset state when navigating away
    this.store.dispatch(resetAmortization());
  }
}
