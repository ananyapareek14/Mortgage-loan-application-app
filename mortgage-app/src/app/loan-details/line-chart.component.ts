import { Component, Input, OnChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

@Component({
  selector: 'app-line-chart',
  template: '<canvas id="lineChart"></canvas>',
})
export class LineChartComponent implements OnChanges {
  @Input() schedule: IAmortizationSchedule[] | null = [];

  ngOnChanges() {
    if (this.schedule) {
      Chart.register(...registerables);
      new Chart('lineChart', {
        type: 'line',
        data: {
          labels: this.schedule.map((s) => s.PaymentNumber),
          datasets: [
            {
              label: 'Remaining Balance',
              data: this.schedule.map((s) => s.RemainingBalance),
              borderColor: 'blue',
              fill: false,
            },
          ],
        },
      });
    }
  }
}

