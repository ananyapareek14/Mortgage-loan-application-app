import { Component, Input, OnChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

@Component({
  selector: 'app-pie-chart',
  template: '<canvas id="pieChart"></canvas>',
})
export class PieChartComponent implements OnChanges {
  @Input() schedule: IAmortizationSchedule[] | null = [];

  ngOnChanges() {
    if (this.schedule) {
      Chart.register(...registerables);
      new Chart('pieChart', {
        type: 'pie',
        data: {
          labels: ['Principal', 'Interest'],
          datasets: [
            {
              data: [
                this.schedule.reduce((sum, s) => sum + s.PrincipalPayment, 0),
                this.schedule.reduce((sum, s) => sum + s.InterestPayment, 0),
              ],
              backgroundColor: ['#4CAF50', '#FF5733'],
            },
          ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow custom width & height
            plugins: {
              legend: {
                position: 'bottom', // Adjust legend position
              },
            },
        },
      });
    }
  }
}
