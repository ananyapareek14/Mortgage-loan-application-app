import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { VaMortgageComponent } from './va-mortgage.component';
import {
  calculateVaMortgage,
  resetVaMortgage,
} from '../../store/calculator/va-mortgage/va-mortgage.actions';
import { IVaMortgageRequest } from '../../models/IVaMortgage';
import { MatTabsModule } from '@angular/material/tabs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('VaMortgageComponent', () => {
  let component: VaMortgageComponent;
  let fixture: ComponentFixture<VaMortgageComponent>;
  // let store: jasmine.SpyObj<Store>;
  let store: MockStore

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    await TestBed.configureTestingModule({
      imports: [VaMortgageComponent, ReactiveFormsModule, MatTabsModule, StoreModule.forRoot({})],
      providers: [ provideMockStore() ],
    }).compileComponents();

    // store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(VaMortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.value).toEqual({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 30,
    });
  });

  it('should dispatch calculateVaMortgage action on ngOnInit', () => {
    const expectedRequest: IVaMortgageRequest = {
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 30,
    };
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      calculateVaMortgage({ request: expectedRequest })
    );
  });

  // it('should update page when new data is received', () => {
  //   const mockData: IVaMortgage[] = [
  //     {
  //       MonthNumber: 1,
  //       MonthlyPayment: 2000,
  //       PrincipalPayment: 1000,
  //       InterestPayment: 1000,
  //       RemainingBalance: 240000,
  //     },
  //     {
  //       MonthNumber: 2,
  //       MonthlyPayment: 1990,
  //       PrincipalPayment: 1000,
  //       InterestPayment: 990,
  //       RemainingBalance: 239000,
  //     },
  //   ];
  //   spyOn(component, 'updatePage');
  //   component['resultSub'].next(mockData);
  //   expect(component.updatePage).toHaveBeenCalledWith(mockData);
  // });

  // it('should handle empty data', () => {
  //   component['resultSub'].next([]);
  //   expect(component.paginatedResults).toEqual([]);
  //   expect(component.totalPages).toBe(1);
  //   expect(component.currentPage).toBe(1);
  //   expect(component.visiblePages).toEqual([]);
  // });

  it('should update visible pages correctly', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    component.updateVisiblePages();
    expect(component.visiblePages).toEqual([3, 4, 5, 6, 7]);
  });

  it('should go to a valid page', () => {
    component.totalPages = 5;
    component.currentPage = 1;
    const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
    component.goToPage(3, mockEvent);
    expect(component.currentPage).toBe(3);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not go to an invalid page', () => {
    component.totalPages = 5;
    component.currentPage = 1;
    const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
    component.goToPage(6, mockEvent);
    expect(component.currentPage).toBe(1);
  });

  it('should submit form with valid data', () => {
    component.form.setValue({
      HomePrice: 400000,
      DownPayment: 80000,
      InterestRate: 4.5,
      LoanTermYears: 15,
    });
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      calculateVaMortgage({
        request: {
          HomePrice: 400000,
          DownPayment: 80000,
          InterestRate: 4.5,
          LoanTermYears: 15,
        },
      })
    );
  });

  it('should not submit form with invalid data', () => {
    component.form.setValue({
      HomePrice: -100000,
      DownPayment: 80000,
      InterestRate: 4.5,
      LoanTermYears: 15,
    });
    component.onSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should reset form and clear data', () => {
    component.onReset();
    expect(component.form.value).toEqual({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 30,
    });
    expect(store.dispatch).toHaveBeenCalledWith(resetVaMortgage());
    expect(component.paginatedResults).toEqual([]);
    expect(component.latestData).toEqual([]);
    expect(component.totalPages).toBe(1);
    expect(component.currentPage).toBe(1);
    expect(component.visiblePages).toEqual([]);
  });

  it('should destroy chart instance on component destroy', () => {
    const mockChart = jasmine.createSpyObj('Chart', ['destroy']);
    component['chartInstance'] = mockChart;
    component.ngOnDestroy();
    expect(mockChart.destroy).toHaveBeenCalled();
  });

  // Edge case: Minimum values
  it('should handle minimum valid values', () => {
    component.form.setValue({
      HomePrice: 1,
      DownPayment: 0,
      InterestRate: 0.01,
      LoanTermYears: 1,
    });
    expect(component.form.valid).toBeTruthy();
  });

  // Edge case: Maximum values
  it('should handle very large values', () => {
    component.form.setValue({
      HomePrice: Number.MAX_SAFE_INTEGER,
      DownPayment: Number.MAX_SAFE_INTEGER - 1,
      InterestRate: 100,
      LoanTermYears: 100,
    });
    expect(component.form.valid).toBeTruthy();
  });

  // Edge case: Down payment greater than home price
  it('should handle down payment greater than home price', () => {
    component.form.setValue({
      HomePrice: 200000,
      DownPayment: 250000,
      InterestRate: 4,
      LoanTermYears: 30,
    });
    expect(component.form.valid).toBeFalsy();
  });

  // Edge case: Zero interest rate
  it('should handle zero interest rate', () => {
    component.form.setValue({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 0,
      LoanTermYears: 30,
    });
    expect(component.form.valid).toBeTruthy();
  });

  // Edge case: Very short loan term
  it('should handle very short loan term', () => {
    component.form.setValue({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 1,
    });
    expect(component.form.valid).toBeTruthy();
  });

  // Edge case: Very long loan term
  it('should handle very long loan term', () => {
    component.form.setValue({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 100,
    });
    expect(component.form.valid).toBeTruthy();
  });
});
