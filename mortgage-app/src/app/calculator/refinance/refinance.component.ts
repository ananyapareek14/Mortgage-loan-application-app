import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import {
  calculateRefinance,
  resetRefinance,
} from '../../store/calculator/refinance/refinance.actions';
import {
  selectRefinanceError,
  selectRefinanceLoading,
  selectRefinanceResult,
} from '../../store/calculator/refinance/refinance.selectors';

import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { IRefinance } from '../../models/IRefinance';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-refinance',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './refinance.component.html',
  styleUrl: './refinance.component.css',
})
export class RefinanceComponent implements AfterViewInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;

  barChart: Chart | undefined;
  lineChart: Chart | undefined;

  form = this.fb.group({
    currentLoanAmount: [200000, [Validators.required, Validators.min(0)]],
    interestRate: [6.5, [Validators.required, Validators.min(0)]],
    currentTermMonths: [360, [Validators.required, Validators.min(1)]],
    originationYear: [2019, [Validators.required, Validators.min(1900)]],
    newLoanAmount: [195000, [Validators.required, Validators.min(0)]],
    newInterestRate: [5, [Validators.required, Validators.min(0)]],
    newTermMonths: [360, [Validators.required, Validators.min(1)]],
    refinanceFees: [1000, [Validators.required, Validators.min(0)]],
  });

  result$ = this.store.pipe(select(selectRefinanceResult));
  loading$ = this.store.pipe(select(selectRefinanceLoading));
  error$ = this.store.pipe(select(selectRefinanceError));

  fieldList = [
  { control: 'currentLoanAmount', label: 'Current Loan Amount' },
  { control: 'interestRate', label: 'Current Interest Rate (%)' },
  { control: 'currentTermMonths', label: 'Current Term (months)' },
  { control: 'originationYear', label: 'Origination Year' },
  { control: 'newLoanAmount', label: 'New Loan Amount' },
  { control: 'newInterestRate', label: 'New Interest Rate (%)' },
  { control: 'newTermMonths', label: 'New Term (months)' },
  { control: 'refinanceFees', label: 'Refinance Fees' },
];

constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
  this.result$.subscribe((result) => {
    if (result) {
      // Wait for canvas to be available in DOM
      setTimeout(() => {
        this.renderBarChart(result);
        this.renderLineChart(result);
      }, 0);
    }
  });
}

  renderBarChart(result: any) {
    if (!this.barChartCanvas) return;
    if (this.barChart) this.barChart.destroy();

    const ctx = this.barChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Old Payment', 'New Payment'],
        datasets: [
          {
            label: 'Monthly Payments ($)',
            data: [result.OldPayment, result.NewPayment],
            backgroundColor: ['#7f9cf5', '#34d399'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

// renderBarChart(result: any): void {
//   const canvas = this.barChartCanvas?.nativeElement;
//   if (!canvas) return;

//   const ctx = canvas.getContext('2d');
//   if (!ctx) return;

//   if (this.barChart) {
//     this.barChart.destroy();
//   }

//   this.barChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ['Costs', '1yrs', '20yrs', '30yrs'],
//       datasets: [
//         {
//           label: 'Costs',
//           data: [result.costs, 0, 0, 0],
//           backgroundColor: ['#ff6b6b', 'transparent', 'transparent', 'transparent'],
//           barThickness: 20,
//         },
//         {
//           label: 'Lifetime savings',
//           data: [0, result.savings1yr, result.savings20yr, result.savings30yr],
//           backgroundColor: ['transparent', '#2ecc71', '#2ecc71', '#2ecc71'],
//           barThickness: 20,
//         }
//       ]
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: { display: false },
//         tooltip: {
//           callbacks: {
//             label: (context) => `$${context.parsed.x.toLocaleString()}`
//           }
//         }
//       },
//       indexAxis: 'y',
//       scales: {
//         x: {
//           beginAtZero: true,
//           ticks: {
//             callback: (value) => `$${(+value / 1000).toFixed(0)}K`
//           }
//         },
//         y: { grid: { display: false } }
//       }
//     }
//   });
// }

  renderLineChart(result: any) {
    if (!this.lineChartCanvas) return;
    if (this.lineChart) this.lineChart.destroy();

    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const savingsOverTime = Array.from({ length: 30 }, (_, i) => ({
      year: i + 1,
      value: (result.MonthlySavings ?? 0) * 12 * (i + 1),
    }));

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: savingsOverTime.map((x) => `Year ${x.year}`),
        datasets: [
          {
            label: 'Cumulative Savings ($)',
            data: savingsOverTime.map((x) => x.value),
            borderColor: '#3b82f6',
            backgroundColor: '#93c5fd88',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();

      const request = {
        CurrentLoanAmount: formValue.currentLoanAmount ?? 0,
        InterestRate: formValue.interestRate ?? 0,
        CurrentTermMonths: formValue.currentTermMonths ?? 0,
        OriginationYear: formValue.originationYear ?? 0,
        NewLoanAmount: formValue.newLoanAmount ?? 0,
        NewInterestRate: formValue.newInterestRate ?? 0,
        NewTermMonths: formValue.newTermMonths ?? 0,
        RefinanceFees: formValue.refinanceFees ?? 0,
      };

      this.store.dispatch(calculateRefinance({ request }));
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.store.dispatch(resetRefinance());
    this.form.reset({
      currentLoanAmount: 0,
      interestRate: 0,
      currentTermMonths: 360,
      originationYear: 2020,
      newLoanAmount: 0,
      newInterestRate: 0,
      newTermMonths: 360,
      refinanceFees: 0,
    });

    if (this.barChart) this.barChart.destroy();
    if (this.lineChart) this.lineChart.destroy();
  }

  ngOnDestroy(): void {
    if (this.barChart) this.barChart.destroy();
    if (this.lineChart) this.lineChart.destroy();
  }
}

