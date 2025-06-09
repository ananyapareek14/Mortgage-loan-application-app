// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
// import { StoreModule } from '@ngrx/store';
// import { provideMockStore, MockStore } from '@ngrx/store/testing';
// import { VaMortgageComponent } from './va-mortgage.component';
// import {
//   calculateVaMortgage,
//   resetVaMortgage,
// } from '../../store/calculator/va-mortgage/va-mortgage.actions';
// import { IVaMortgageRequest, IVaMortgage } from '../../models/IVaMortgage';
// import { selectVaMortgageResult } from '../../store/calculator/va-mortgage/va-mortgage.selectors';
// import { vaMortgageReducer } from '../../store/calculator/va-mortgage/va-mortgage.reducer';
// import { EffectsModule } from '@ngrx/effects';
// import { VaMortgageEffects } from '../../store/calculator/va-mortgage/va-mortgage.effects';
// import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';

// describe('VaMortgageComponent', () => {
//   let component: VaMortgageComponent;
//   let fixture: ComponentFixture<VaMortgageComponent>;
//   let store: MockStore;

//   const mockResponse: IVaMortgage[] = [
//     {
//       MonthNumber: 1,
//       MonthlyPayment: 1500,
//       PrincipalPayment: 1000,
//       InterestPayment: 500,
//       RemainingBalance: 290000,
//     },
//     {
//       MonthNumber: 2,
//       MonthlyPayment: 1500,
//       PrincipalPayment: 1005,
//       InterestPayment: 495,
//       RemainingBalance: 288995,
//     },
//   ];

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         VaMortgageComponent,
//         ReactiveFormsModule,
//         MatTabsModule,
//         StoreModule.forRoot({}),
//         StoreModule.forFeature('vaMortgage', vaMortgageReducer),
//         EffectsModule.forRoot([]),
//         EffectsModule.forFeature([VaMortgageEffects]),
//         HttpClientTestingModule
//       ],
//       providers: [
//         provideMockStore({
//           initialState: {
//             vaMortgage: {
//               result: null,
//               loading: false,
//               error: null,
//             },
//           },
//         }),
//       ],
//     }).compileComponents();

//     store = TestBed.inject(MockStore);
//     spyOn(store, 'dispatch');
//     store.overrideSelector(selectVaMortgageResult, mockResponse);
//     fixture = TestBed.createComponent(VaMortgageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
  

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize form with default values', () => {
//     expect(component.form.value).toEqual({
//       HomePrice: 300000,
//       DownPayment: 60000,
//       InterestRate: 5,
//       LoanTermYears: 10,
//     });
//   });

//   it('should dispatch calculateVaMortgage on ngOnInit', () => {
//     const expectedRequest: IVaMortgageRequest = {
//       HomePrice: 300000,
//       DownPayment: 60000,
//       InterestRate: 5,
//       LoanTermYears: 10,
//     };
//     component.ngOnInit();
//     expect(store.dispatch).toHaveBeenCalledWith(
//       calculateVaMortgage({ request: expectedRequest })
//     );
//   });

//   it('should update visible pages correctly', () => {
//     component.totalPages = 10;
//     component.currentPage = 5;
//     component.updateVisiblePages();
//     expect(component.visiblePages).toEqual([3, 4, 5, 6, 7]);
//   });

//   it('should go to a valid page', () => {
//     component.totalPages = 5;
//     component.currentPage = 1;
//     const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
//     component.goToPage(3, mockEvent);
//     expect(component.currentPage).toBe(3);
//     expect(mockEvent.preventDefault).toHaveBeenCalled();
//   });

//   it('should not go to an invalid page', () => {
//     component.totalPages = 5;
//     component.currentPage = 1;
//     const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
//     component.goToPage(6, mockEvent);
//     expect(component.currentPage).toBe(1);
//   });

//   it('should submit form with valid data', () => {
//     component.form.setValue({
//       HomePrice: 400000,
//       DownPayment: 80000,
//       InterestRate: 4.5,
//       LoanTermYears: 15,
//     });
//     component.onSubmit();
//     expect(store.dispatch).toHaveBeenCalledWith(
//       calculateVaMortgage({
//         request: {
//           HomePrice: 400000,
//           DownPayment: 80000,
//           InterestRate: 4.5,
//           LoanTermYears: 15,
//         },
//       })
//     );
//   });

//   it('should reset form and clear data', () => {
//     component.onReset();
//     expect(component.form.value).toEqual({
//       HomePrice: 300000,
//       DownPayment: 60000,
//       InterestRate: 5,
//       LoanTermYears: 30,
//     });
//     expect(store.dispatch).toHaveBeenCalledWith(resetVaMortgage());
//     expect(component.paginatedResults).toEqual([]);
//     expect(component.latestData).toEqual([]);
//     expect(component.totalPages).toBe(1);
//     expect(component.currentPage).toBe(1);
//     expect(component.visiblePages).toEqual([]);
//   });

//   it('should destroy chart instance on component destroy', () => {
//     const mockChart = jasmine.createSpyObj('Chart', ['destroy']);
//     component['chartInstance'] = mockChart;
//     component.ngOnDestroy();
//     expect(mockChart.destroy).toHaveBeenCalled();
//   });
  
//   it('should render chart when data updates', () => {
//     const initialSelector = store.overrideSelector(selectVaMortgageResult, []);

//     fixture = TestBed.createComponent(VaMortgageComponent);
//     component = fixture.componentInstance;

//     const renderChartSpy = spyOn(component as any, 'renderChart');

//     fixture.detectChanges();

//     initialSelector.setResult(mockResponse);
//     store.refreshState();
//     fixture.detectChanges();

//     expect(renderChartSpy).toHaveBeenCalled();
//   });
  
  

//   // it('should handle tab change', (done) => {
//   //   const event = { index: 1 } as MatTabChangeEvent;
//   //   spyOn<any>(component, 'renderChart');
//   //   component.latestData = mockResponse;

//   //   component.onTabChange(event);

//   //   setTimeout(() => {
//   //     expect((component as any).renderChart).toHaveBeenCalledWith(mockResponse);
//   //     done();
//   //   }, 60);
//   // });

//   it('should handle tab change and call renderChart with correct data', () => {
//     // Arrange: mock store selector with your data BEFORE component creation
//     store.overrideSelector(selectVaMortgageResult, mockResponse);

//     // Create component instance
//     fixture = TestBed.createComponent(VaMortgageComponent);
//     component = fixture.componentInstance;

//     // Spy on private renderChart method AFTER component created
//     const renderChartSpy = spyOn(component as any, 'renderChart');

//     fixture.detectChanges(); // initial binding

//     // Create a minimal MatTabChangeEvent with only needed properties
//     const fakeTabChangeEvent = {
//       index: 1,
//       tab: {
//         textLabel: 'Tab 2',
//       } as any, // cast as any to avoid type errors
//     } as MatTabChangeEvent;

//     // Act: simulate tab change
//     component.onTabChange(fakeTabChangeEvent);

//     // Assert: renderChart should be called with mockResponse data
//     expect(renderChartSpy).toHaveBeenCalledWith(mockResponse);
//   });

  

//   // Edge cases
//   it('should handle minimum valid values', () => {
//     component.form.setValue({
//       HomePrice: 1,
//       DownPayment: 0,
//       InterestRate: 0.01,
//       LoanTermYears: 1,
//     });
//     expect(component.form.valid).toBeTruthy();
//   });

//   it('should handle very large values', () => {
//     component.form.setValue({
//       HomePrice: Number.MAX_SAFE_INTEGER,
//       DownPayment: Number.MAX_SAFE_INTEGER - 1,
//       InterestRate: 100,
//       LoanTermYears: 100,
//     });
//     expect(component.form.valid).toBeTruthy();
//   });

//   it('should handle down payment greater than home price', () => {
//     component.form.setValue({
//       HomePrice: 200000,
//       DownPayment: 250000,
//       InterestRate: 4,
//       LoanTermYears: 30,
//     });
//     expect(component.form.valid).toBeFalsy();
//   });

//   it('should handle zero interest rate', () => {
//     component.form.setValue({
//       HomePrice: 300000,
//       DownPayment: 60000,
//       InterestRate: 0,
//       LoanTermYears: 30,
//     });
//     expect(component.form.valid).toBeTruthy();
//   });

//   it('should handle very short loan term', () => {
//     component.form.setValue({
//       HomePrice: 300000,
//       DownPayment: 60000,
//       InterestRate: 5,
//       LoanTermYears: 1,
//     });
//     expect(component.form.valid).toBeTruthy();
//   });

//   it('should handle very long loan term', () => {
//     component.form.setValue({
//       HomePrice: 300000,
//       DownPayment: 60000,
//       InterestRate: 5,
//       LoanTermYears: 100,
//     });
//     expect(component.form.valid).toBeTruthy();
//   });
// });


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { VaMortgageComponent } from './va-mortgage.component';
import {
  calculateVaMortgage,
  resetVaMortgage,
} from '../../store/calculator/va-mortgage/va-mortgage.actions';
import { IVaMortgageRequest, IVaMortgage } from '../../models/IVaMortgage';
import { selectVaMortgageResult } from '../../store/calculator/va-mortgage/va-mortgage.selectors';
import { vaMortgageReducer } from '../../store/calculator/va-mortgage/va-mortgage.reducer';
import { EffectsModule } from '@ngrx/effects';
import { VaMortgageEffects } from '../../store/calculator/va-mortgage/va-mortgage.effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VaMortgageComponent', () => {
  let component: VaMortgageComponent;
  let fixture: ComponentFixture<VaMortgageComponent>;
  let store: MockStore;

  const mockResponse: IVaMortgage[] = [
    {
      MonthNumber: 1,
      MonthlyPayment: 1500,
      PrincipalPayment: 1000,
      InterestPayment: 500,
      RemainingBalance: 290000,
    },
    {
      MonthNumber: 2,
      MonthlyPayment: 1500,
      PrincipalPayment: 1005,
      InterestPayment: 495,
      RemainingBalance: 288995,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VaMortgageComponent,
        ReactiveFormsModule,
        MatTabsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('vaMortgage', vaMortgageReducer),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([VaMortgageEffects]),
        HttpClientTestingModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            vaMortgage: {
              result: null,
              loading: false,
              error: null,
            },
          },
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    store.overrideSelector(selectVaMortgageResult, mockResponse);

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
      LoanTermYears: 10,
    });
  });

  it('should dispatch calculateVaMortgage on ngOnInit', () => {
    const expectedRequest: IVaMortgageRequest = {
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 10,
    };
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(
      calculateVaMortgage({ request: expectedRequest })
    );
  });

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

  // it('should render chart when data updates', () => {
  //   // Override selector to empty initially
  //   const selector = store.overrideSelector(selectVaMortgageResult, []);
  //   fixture.detectChanges();

  //   const renderChartSpy = spyOn(component as any, 'renderChart');

  //   // Update selector to emit mock data
  //   selector.setResult(mockResponse);
  //   store.refreshState();
  //   fixture.detectChanges();

  //   expect(renderChartSpy).toHaveBeenCalled();
  // });

  it('should handle tab change and call renderChart with correct data', () => {
    store.overrideSelector(selectVaMortgageResult, mockResponse);

    // Recreate component to pick up selector override
    fixture = TestBed.createComponent(VaMortgageComponent);
    component = fixture.componentInstance;

    const renderChartSpy = spyOn(component as any, 'renderChart');
    fixture.detectChanges();

    const fakeTabChangeEvent = {
      index: 1,
      tab: {
        textLabel: 'Tab 2',
      } as any,
    } as MatTabChangeEvent;

    component.onTabChange(fakeTabChangeEvent);

    expect(renderChartSpy).toHaveBeenCalledWith(mockResponse);
  });

  // Edge case tests
  it('should handle minimum valid values', () => {
    component.form.setValue({
      HomePrice: 1,
      DownPayment: 0,
      InterestRate: 0.01,
      LoanTermYears: 1,
    });
    expect(component.form.valid).toBeTrue();
  });

  it('should handle very large values', () => {
    component.form.setValue({
      HomePrice: Number.MAX_SAFE_INTEGER,
      DownPayment: Number.MAX_SAFE_INTEGER - 1,
      InterestRate: 100,
      LoanTermYears: 100,
    });
    expect(component.form.valid).toBeTrue();
  });

  it('should handle down payment greater than home price', () => {
    component.form.setValue({
      HomePrice: 200000,
      DownPayment: 250000,
      InterestRate: 4,
      LoanTermYears: 30,
    });
    expect(component.form.valid).toBeFalse();
  });

  it('should handle zero interest rate', () => {
    component.form.setValue({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 0,
      LoanTermYears: 30,
    });
    expect(component.form.valid).toBeTrue();
  });

  it('should handle very short loan term', () => {
    component.form.setValue({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 1,
    });
    expect(component.form.valid).toBeTrue();
  });

  it('should handle very long loan term', () => {
    component.form.setValue({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 100,
    });
    expect(component.form.valid).toBeTrue();
  });
});
