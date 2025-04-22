import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

@Component({
  selector: 'app-pie-chart',
  template: '<canvas #pieChart></canvas>',
})
export class PieChartComponent implements AfterViewInit,OnChanges {
  @Input() schedule: IAmortizationSchedule[] | null = [];
  @ViewChild('pieChart') chartRef!: ElementRef<HTMLCanvasElement>;

  // private chart: Chart | undefined;
  public chart: Chart | undefined;
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
        this.chart.destroy(); // Destroy old chart
      }

      Chart.register(...registerables);
      this.chart = new Chart(this.chartRef.nativeElement, {
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
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
        },
      });
    }
  }

