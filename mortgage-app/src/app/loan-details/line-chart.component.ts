import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

@Component({
  selector: 'app-line-chart',
  template: `<canvas #lineChart></canvas>`,
})
export class LineChartComponent implements AfterViewInit, OnChanges {
  @Input() schedule: IAmortizationSchedule[] | null = [];
  @ViewChild('lineChart') chartRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | undefined;
  private viewInitialized = false;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewInitialized && changes['schedule']) {
      this.createChart();
    }
  }

  private createChart(): void {
    if (!this.chartRef || !this.schedule || this.schedule.length === 0) return;

    if (this.chart) {
      this.chart.destroy();
    }

    Chart.register(...registerables);
    this.chart = new Chart(this.chartRef.nativeElement, {
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

