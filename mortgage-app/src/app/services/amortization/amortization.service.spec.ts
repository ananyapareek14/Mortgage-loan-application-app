import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AmortizationService } from './amortization.service';
import { environment } from '../../environment/environment';
import {
  IAmortizationRequest,
  IAmortizationSchedule,
} from '../../models/IAmortizationSchedule';

describe('Amortization Service', () => {
  let service: AmortizationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AmortizationService],
    });
    service = TestBed.inject(AmortizationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateAmortization', () => {
    it('should send a POST request with the correct URL and body', () => {
      const mockRequest: IAmortizationRequest = {
        LoanAmount: 100000,
        InterestRate: 5,
        LoanTermYears: 30,
      };
      const mockResponse: IAmortizationSchedule[] = [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-07-01'),
          MonthlyPayment: 536.82,
          PrincipalPayment: 120.15,
          InterestPayment: 416.67,
          RemainingBalance: 99879.85,
        },
      ];

      service.calculateAmortization(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/calculate`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });

    it('should handle empty response', () => {
      const mockRequest: IAmortizationRequest = {
        LoanAmount: 0,
        InterestRate: 0,
        LoanTermYears: 0,
      };

      service.calculateAmortization(mockRequest).subscribe((response) => {
        expect(response).toEqual([]);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/calculate`
      );
      req.flush([]);
    });

    it('should handle server error', () => {
      const mockRequest: IAmortizationRequest = {
        LoanAmount: 100000,
        InterestRate: 5,
        LoanTermYears: 30,
      };
      const mockError = { status: 500, statusText: 'Server Error' };

      service.calculateAmortization(mockRequest).subscribe(
        () => fail('should have failed with the 500 error'),
        (error: any) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        }
      );

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/calculate`
      );
      req.flush('', mockError);
    });

    it('should handle negative loan amount', () => {
      const mockRequest: IAmortizationRequest = {
        LoanAmount: -100000,
        InterestRate: 5,
        LoanTermYears: 30,
      };

      service.calculateAmortization(mockRequest).subscribe(
        () => fail('should have failed with an error'),
        (error: any) => {
          expect(error).toBeTruthy();
        }
      );

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/calculate`
      );
      req.error(new ErrorEvent('Invalid loan amount'));
    });

    it('should handle extremely high interest rate', () => {
      const mockRequest: IAmortizationRequest = {
        LoanAmount: 100000,
        InterestRate: 1000,
        LoanTermYears: 30,
      };

      service.calculateAmortization(mockRequest).subscribe(
        () => fail('should have failed with an error'),
        (error: any) => {
          expect(error).toBeTruthy();
        }
      );

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/calculate`
      );
      req.error(new ErrorEvent('Invalid interest rate'));
    });
  });

  describe('getAmortizationByLoanId', () => {
    it('should send a GET request with the correct URL', () => {
      const userLoanNumber = 12345;
      const mockResponse: IAmortizationSchedule[] = [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-07-01'),
          MonthlyPayment: 536.82,
          PrincipalPayment: 120.15,
          InterestPayment: 416.67,
          RemainingBalance: 99879.85,
        },
      ];

      service.getAmortizationByLoanId(userLoanNumber).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/${userLoanNumber}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty response for non-existent loan', () => {
      const userLoanNumber = 99999;

      service.getAmortizationByLoanId(userLoanNumber).subscribe((response) => {
        expect(response).toEqual([]);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/${userLoanNumber}`
      );
      req.flush([]);
    });

    it('should handle server error', () => {
      const userLoanNumber = 12345;
      const mockError = { status: 404, statusText: 'Not Found' };

      service.getAmortizationByLoanId(userLoanNumber).subscribe(
        () => fail('should have failed with the 404 error'),
        (error: any) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      );

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/${userLoanNumber}`
      );
      req.flush('', mockError);
    });

    it('should handle negative loan number', () => {
      const userLoanNumber = -1;

      service.getAmortizationByLoanId(userLoanNumber).subscribe(
        () => fail('should have failed with an error'),
        (error: any) => {
          expect(error).toBeTruthy();
        }
      );

      const req = httpMock.expectOne(
        `${environment.apiUrl}/amortization/${userLoanNumber}`
      );
      req.error(new ErrorEvent('Invalid loan number'));
    });
  });
});
