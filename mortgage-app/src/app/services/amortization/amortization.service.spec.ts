import { TestBed } from '@angular/core/testing';
import { AmortizationService } from './amortization.service';
import { environment } from '../../environment/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IAmortizationRequest, IAmortizationSchedule } from '../../models/IAmortizationSchedule';

describe('Amortization Service', () => {
  let service: AmortizationService;
  let httpMock: HttpTestingController;

  const mockRequest: IAmortizationRequest = {
    LoanAmount: 10000,
    InterestRate: 5,
    LoanTermYears: 5,
  };

  const mockSchedule: IAmortizationSchedule[] = [
    {
      PaymentNumber: 1,
      PaymentDate: new Date('2024-02-01'),
      MonthlyPayment: 500,
      PrincipalPayment: 300,
      InterestPayment: 200,
      RemainingBalance: 9700
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AmortizationService]
    });

    service = TestBed.inject(AmortizationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should calculate amortization schedule', () => {
    service.calculateAmortization(mockRequest).subscribe(schedule => {
      expect(schedule).toEqual(mockSchedule);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/amortization/calculate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);

    req.flush(mockSchedule);
  });

  it('should fetch amortization by loan ID', () => {
    const loanId = 1;

    service.getAmortizationByLoanId(loanId).subscribe(schedule => {
      expect(schedule).toEqual(mockSchedule);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/amortization/${loanId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSchedule);
  });
});
