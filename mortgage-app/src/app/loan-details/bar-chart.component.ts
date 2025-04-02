import { Component, Input, OnChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

@Component({
  selector: 'app-bar-chart',
  template: '<canvas id="barChart"></canvas>',
})
export class BarChartComponent implements OnChanges {
  @Input() schedule: IAmortizationSchedule[] | null = [];

  ngOnChanges() {
    if (this.schedule) {
      Chart.register(...registerables);
      new Chart('barChart', {
        type: 'bar',
        data: {
          labels: this.schedule.map((s) => s.PaymentNumber),
          datasets: [
            {
              label: 'Principal',
              data: this.schedule.map((s) => s.PrincipalPayment),
              backgroundColor: '#4CAF50',
            },
            {
              label: 'Interest',
              data: this.schedule.map((s) => s.InterestPayment),
              backgroundColor: '#FF5733',
            },
          ],
        },
      });
    }
  }
}
