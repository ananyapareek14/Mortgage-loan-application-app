import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';
import { ElementRef } from '@angular/core';

// Mocking Chart.js
class MockChart {
  destroy = jasmine.createSpy('destroy');
  constructor(public canvas: any, public config: any) {}
}

describe('Bar Chart Component', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;
  let mockSchedule: IAmortizationSchedule[];

  beforeAll(() => {
    // Replace Chart constructor globally
    (window as any).Chart = MockChart;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;

    mockSchedule = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 700,
        InterestPayment: 300,
        RemainingBalance: 93000,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 710,
        InterestPayment: 290,
        RemainingBalance: 92290,
      },
    ];

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not create chart if schedule is empty', () => {
    component.schedule = [];
    component.ngAfterViewInit();
    expect(component['chart']).toBeUndefined();
  });

  it('should create chart on ngAfterViewInit if schedule exists', () => {
    component.schedule = mockSchedule;

    fixture.detectChanges();
    component.ngAfterViewInit();

    expect(component['chart']).toBeDefined();
  });

  it('should call createChart on ngOnChanges after view is initialized', () => {
    component.schedule = mockSchedule;
    const createChartSpy = spyOn<any>(component, 'createChart');
    component.ngAfterViewInit();

    component.ngOnChanges({
      schedule: {
        currentValue: mockSchedule,
        previousValue: [],
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(createChartSpy).toHaveBeenCalled();
  });
    
    it('should not call createChart on ngOnChanges if view is not initialized', () => {
      const createChartSpy = spyOn<any>(component, 'createChart');
      component['viewInitialized'] = false;

      component.ngOnChanges({
        schedule: {
          currentValue: mockSchedule,
          previousValue: [],
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(createChartSpy).not.toHaveBeenCalled();
    });


  it('should destroy previous chart before creating a new one', () => {
    // Fake canvas element
    const canvas = document.createElement('canvas');
    component.chartRef = new ElementRef(canvas);

    // First chart mock with spyable destroy
    const destroySpy = jasmine.createSpy('destroy');
    component['chart'] = { destroy: destroySpy } as any;

    // Simulate initialized view
    component['viewInitialized'] = true;
    component.schedule = mockSchedule;

    component.ngOnChanges({
      schedule: {
        currentValue: mockSchedule,
        previousValue: [],
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(destroySpy).toHaveBeenCalled();
  });

});
