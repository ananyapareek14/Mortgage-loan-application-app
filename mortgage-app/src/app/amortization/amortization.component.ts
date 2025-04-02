import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter, Observable } from 'rxjs';
import { IAmortizationRequest, IAmortizationSchedule } from '../models/IAmortizationSchedule';
import { Store } from '@ngrx/store';
import { selectAmortizationSchedule } from '../store/amortization/amortization.selectors';
import { calculateAmortization } from '../store/amortization/amortization.actions';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-amortization',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CurrencyPipe],
  templateUrl: './amortization.component.html',
  styleUrl: './amortization.component.css',
})
export class AmortizationComponent implements OnInit {
  amortizationForm!: FormGroup;
  amortizationSchedule$!: Observable<IAmortizationSchedule[]>;
  totalInterest: number = 0;
  totalPayment: number = 0;
  monthlyPayment: number = 0;
  chart!: Chart;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    this.amortizationForm = this.fb.group({
      LoanAmount: [100000, []],
      InterestRate: [5, []],
      LoanTermYears: [15, []],
    });
this.amortizationSchedule$ = this.store.select(selectAmortizationSchedule).pipe(
  filter((schedule) => schedule !== null) // Ensures we only get non-null values
);
    this.renderChart();
    this.amortizationSchedule$.subscribe((schedule) => {
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
    this.totalInterest = schedule.reduce(
      (sum, p) => sum + p.InterestPayment,
      0
    );
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
}