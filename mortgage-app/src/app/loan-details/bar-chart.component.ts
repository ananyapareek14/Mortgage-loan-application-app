import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

@Component({
  selector: 'app-bar-chart',
  template: '<canvas #barChart></canvas>',
})
export class BarChartComponent implements OnChanges {
  @Input() schedule: IAmortizationSchedule[] | null = [];
  @ViewChild('barChart') chartRef!: ElementRef<HTMLCanvasElement>;

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
