import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CalculatorService } from './calculators.service';
import { environment } from '../../environment/environment';
import {
  IAffordabilityRequest,
  IAffordability,
} from '../../models/IAffordability';
import {
  IDebtToIncomeRequest,
  IDebtToIncome,
} from '../../models/IDebt-To-Income';
import { IRefinanceRequest, IRefinance } from '../../models/IRefinance';
import { IVaMortgageRequest, IVaMortgage } from '../../models/IVaMortgage';

describe('CalculatorService', () => {
  let service: CalculatorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CalculatorService],
    });
    service = TestBed.inject(CalculatorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateAffordability', () => {
    it('should calculate affordability for valid request', () => {
      const mockRequest: IAffordabilityRequest = {
        AnnualIncome: 100000,
        DownPayment: 20000,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: 1000,
      };
      const mockResponse: IAffordability = {
        MaxAffordableHomePrice: 400000,
        EstimatedLoanAmount: 380000,
        EstimatedMonthlyPayment: 1706.69,
        DtiPercentage: 36,
        AnnualIncome: 100000,
        DownPayment: 20000,
        LoanTermMonths: 360,
        InterestRate: 3.5,
        MonthlyDebts: 1000,
      };

      service.calculateAffordability(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/affordability/calculate`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle zero down payment edge case', () => {
      const mockRequest: IAffordabilityRequest = {
        AnnualIncome: 80000,
        DownPayment: 0,
        LoanTermMonths: 360,
        InterestRate: 4,
        MonthlyDebts: 800,
      };
      const mockResponse: IAffordability = {
        MaxAffordableHomePrice: 300000,
        EstimatedLoanAmount: 300000,
        EstimatedMonthlyPayment: 1432.25,
        DtiPercentage: 38,
        AnnualIncome: 80000,
        DownPayment: 0,
        LoanTermMonths: 360,
        InterestRate: 4,
        MonthlyDebts: 800,
      };

      service.calculateAffordability(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/affordability/calculate`
      );
      req.flush(mockResponse);
    });
  });

  describe('calculateDti', () => {
    it('should calculate debt-to-income ratio for valid request', () => {
      const mockRequest: IDebtToIncomeRequest = {
        AnnualIncome: 120000,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 400,
        ProposedMonthlyPayment: 1500,
        CalculateDefaultPayment: false,
      };
      const mockResponse: IDebtToIncome = {
        DtiPercentage: 36,
        TotalDebts: 2400,
        ProposedMonthlyPayment: 1500,
        RemainingMonthlyIncome: 7600,
      };

      service.calculateDti(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/debt-to-income/calculate`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle zero income edge case', () => {
      const mockRequest: IDebtToIncomeRequest = {
        AnnualIncome: 0,
        MinCreditCardPayments: 100,
        CarLoanPayments: 200,
        StudentLoanPayments: 300,
        ProposedMonthlyPayment: 1000,
        CalculateDefaultPayment: true,
      };
      const mockResponse: IDebtToIncome = {
        DtiPercentage: Infinity,
        TotalDebts: 1600,
        ProposedMonthlyPayment: 1000,
        RemainingMonthlyIncome: -1600,
      };

      service.calculateDti(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/debt-to-income/calculate`
      );
      req.flush(mockResponse);
    });
  });

  describe('calculateRefinance', () => {
    it('should calculate refinance for valid request', () => {
      const mockRequest: IRefinanceRequest = {
        CurrentLoanAmount: 300000,
        InterestRate: 4.5,
        CurrentTermMonths: 360,
        OriginationYear: 2018,
        NewLoanAmount: 280000,
        NewInterestRate: 3.5,
        NewTermMonths: 360,
        RefinanceFees: 3000,
      };
      const mockResponse: IRefinance = {
        MonthlySavings: 250,
        NewPayment: 1257.13,
        BreakEvenMonths: 12,
        LifetimeSavings: 87000,
      };

      service.calculateRefinance(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/refinance/calculate`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle no savings scenario', () => {
      const mockRequest: IRefinanceRequest = {
        CurrentLoanAmount: 200000,
        InterestRate: 3.5,
        CurrentTermMonths: 360,
        OriginationYear: 2020,
        NewLoanAmount: 200000,
        NewInterestRate: 3.5,
        NewTermMonths: 360,
        RefinanceFees: 5000,
      };
      const mockResponse: IRefinance = {
        MonthlySavings: 0,
        NewPayment: 898.09,
        BreakEvenMonths: Infinity,
        LifetimeSavings: -5000,
      };

      service.calculateRefinance(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/refinance/calculate`
      );
      req.flush(mockResponse);
    });
  });

  describe('calculateVaMortgage', () => {
    it('should calculate VA mortgage for valid request', () => {
      const mockRequest: IVaMortgageRequest = {
        HomePrice: 300000,
        DownPayment: 30000,
        InterestRate: 3.5,
        LoanTermYears: 30,
      };
      const mockResponse: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 1212.85,
          PrincipalPayment: 462.85,
          InterestPayment: 750,
          RemainingBalance: 269537.15,
        },
        // ... more months
      ];

      service.calculateVaMortgage(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/va-mortgage-schedule/calculate`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle zero down payment for VA loan', () => {
      const mockRequest: IVaMortgageRequest = {
        HomePrice: 250000,
        DownPayment: 0,
        InterestRate: 3.25,
        LoanTermYears: 15,
      };
      const mockResponse: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 1751.79,
          PrincipalPayment: 1095.54,
          InterestPayment: 656.25,
          RemainingBalance: 248904.46,
        },
        // ... more months
      ];

      service.calculateVaMortgage(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/va-mortgage-schedule/calculate`
      );
      req.flush(mockResponse);
    });
  });
});
