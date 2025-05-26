// import { TestBed } from '@angular/core/testing';
// import {
//   HttpClientTestingModule,
//   HttpTestingController,
// } from '@angular/common/http/testing';
// import { CalculatorService } from './calculators.service';
// import { environment } from '../../environment/environment';
// import {
//   IAmortizationRequest,
//   IAmortizationSchedule,
// } from '../../models/IAmortizationSchedule';
// import {
//   IAffordabilityRequest,
//   IAffordability,
// } from '../../models/IAffordability';
// import {
//   IDebtToIncomeRequest,
//   IDebtToIncome,
// } from '../../models/IDebt-To-Income';
// import { IRefinanceRequest, IRefinance } from '../../models/IRefinance';
// import { IVaMortgageRequest, IVaMortgage } from '../../models/IVaMortgage';

// describe('CalculatorService', () => {
//   let service: CalculatorService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [CalculatorService],
//     });
//     service = TestBed.inject(CalculatorService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });


//   describe('calculateAffordability', () => {
//     it('should return affordability data for valid request', () => {
//       const mockRequest: IAffordabilityRequest = {
//         /* mock data */
//       };
//       const mockResponse: IAffordability = {
//         /* mock data */
//       };

//       service.calculateAffordability(mockRequest).subscribe((response) => {
//         expect(response).toEqual(mockResponse);
//       });

//       const req = httpMock.expectOne(
//         `${environment.apiUrl}/affordability/calculate`
//       );
//       expect(req.request.method).toBe('POST');
//       req.flush(mockResponse);
//     });

//     it('should handle error response', () => {
//       const mockRequest: IAffordabilityRequest = {
//         /* mock data */
//       };
//       const mockError = { status: 500, statusText: 'Internal Server Error' };

//       service.calculateAffordability(mockRequest).subscribe(
//         () => fail('should have failed with the 500 error'),
//         (error) => {
//           expect(error.status).toBe(500);
//           expect(error.statusText).toBe('Internal Server Error');
//         }
//       );

//       const req = httpMock.expectOne(
//         `${environment.apiUrl}/affordability/calculate`
//       );
//       req.flush('Server error', mockError);
//     });
//   });

//   describe('calculateDti', () => {
//     it('should return debt-to-income data for valid request', () => {
//       const mockRequest: IDebtToIncomeRequest = {
//         /* mock data */
//       };
//       const mockResponse: IDebtToIncome = {
//         /* mock data */
//       };

//       service.calculateDti(mockRequest).subscribe((response) => {
//         expect(response).toEqual(mockResponse);
//       });

//       const req = httpMock.expectOne(
//         `${environment.apiUrl}/debt-to-income/calculate`
//       );
//       expect(req.request.method).toBe('POST');
//       req.flush(mockResponse);
//     });

//     it('should handle zero values in request', () => {
//       const mockRequest: IDebtToIncomeRequest = {
//         /* mock data with zero values */
//       };
//       const mockResponse: IDebtToIncome = {
//         /* expected response for zero values */
//       };

//       service.calculateDti(mockRequest).subscribe((response) => {
//         expect(response).toEqual(mockResponse);
//       });

//       const req = httpMock.expectOne(
//         `${environment.apiUrl}/debt-to-income/calculate`
//       );
//       req.flush(mockResponse);
//     });
//   });

//   describe('calculateRefinance', () => {
//     it('should return refinance data for valid request', () => {
//       const mockRequest: IRefinanceRequest = {
//         /* mock data */
//       };
//       const mockResponse: IRefinance = {
//         /* mock data */
//       };

//       service.calculateRefinance(mockRequest).subscribe((response) => {
//         expect(response).toEqual(mockResponse);
//       });

//       const req = httpMock.expectOne(
//         `${environment.apiUrl}/refinance/calculate`
//       );
//       expect(req.request.method).toBe('POST');
//       req.flush(mockResponse);
//     });

//     it('should log API request payload and backend response', () => {
//       const mockRequest: IRefinanceRequest = {
//         /* mock data */
//       };
//       const mockResponse: IRefinance = {
//         /* mock data */
//       };
//       spyOn(console, 'log');

//       service.calculateRefinance(mockRequest).subscribe();

//       const req = httpMock.expectOne(
//         `${environment.apiUrl}/refinance/calculate`
//       );
//       req.flush(mockResponse);

//       expect(console.log).toHaveBeenCalledWith(
//         '🚀 API request payload:',
//         mockRequest
//       );
//       expect(console.log).toHaveBeenCalledWith(
//         'Backend Response:',
//         mockResponse
//       );
//     });
//   });

//   describe('calculateVaMortgage', () => {
//     it('should return VA mortgage data for valid request', () => {
//       const mockRequest: IVaMortgageRequest = {
//         /* mock data */
//       };
//       const mockResponse: IVaMortgage[] = [
//         {
//           /* mock data */
//         },
//       ];

//       service.calculateVaMortgage(mockRequest).subscribe((response) => {
//         expect(response).toEqual(mockResponse);
//       });

//       const req = httpMock.expectOne(
//         `${environment.apiUrl}/va-mortgage-schedule/calculate`
//       );
//       expect(req.request.method).toBe('POST');
//       req.flush(mockResponse);
//     });

//     it('should handle empty response', () => {
//       const mockRequest: IVaMortgageRequest = {
//         /* mock data */
//       };
//       const mockResponse: IVaMortgage[] = [];

//       service.calculateVaMortgage(mockRequest).subscribe((response) => {
//         expect(response).toEqual([]);
//       });

//       const req = httpMock.expectOne(
//         `${environment.apiUrl}/va-mortgage-schedule/calculate`
//       );
//       req.flush(mockResponse);
//     });
//   });
// });
