import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoanService } from './loan.service';
import { ILoan } from '../../models/ILoan';
import { environment } from '../../environment/environment';

describe('Loan Service', () => {
  let service: LoanService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanService],
    });
    service = TestBed.inject(LoanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLoans', () => {
    it('should return an Observable<ILoan[]>', () => {
      const dummyLoans: ILoan[] = [
        {
          UserLoanNumber: 1,
          LoanAmount: 100000,
          InterestRate: 5,
          LoanTermYears: 30,
          ApplicationDate: '2023-05-01',
          ApprovalStatus: 'Approved',
        },
        {
          UserLoanNumber: 2,
          LoanAmount: 200000,
          InterestRate: 4.5,
          LoanTermYears: 15,
          ApplicationDate: '2023-05-02',
          ApprovalStatus: 'Pending',
        },
      ];

      service.getLoans().subscribe((loans) => {
        expect(loans.length).toBe(2);
        expect(loans).toEqual(dummyLoans);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyLoans);
    });

    it('should handle empty response', () => {
      service.getLoans().subscribe((loans) => {
        expect(loans.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
      req.flush([]);
    });

    it('should handle error response', () => {
      service.getLoans().subscribe(
        () => fail('should have failed with the 404 error'),
        (error: any) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createLoan', () => {
    it('should create a loan and return it', () => {
      const newLoan: ILoan = {
        UserLoanNumber: 3,
        LoanAmount: 150000,
        InterestRate: 3.75,
        LoanTermYears: 20,
        ApplicationDate: '2023-05-03',
        ApprovalStatus: 'Pending',
      };
      const createdLoan: ILoan = { LoanId: 1, ...newLoan };

      service.createLoan(newLoan).subscribe((loan) => {
        expect(loan).toEqual(createdLoan);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newLoan);
      req.flush(createdLoan);
    });

    it('should handle error when creating a loan with invalid data', () => {
      const invalidLoan: ILoan = {
        UserLoanNumber: -1,
        LoanAmount: -100000,
        InterestRate: -5,
        LoanTermYears: 0,
        ApplicationDate: 'invalid-date',
        ApprovalStatus: 'Invalid',
      };

      service.createLoan(invalidLoan).subscribe(
        () => fail('should have failed with the 400 error'),
        (error: any) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getLoanById', () => {
    it('should return a loan by id', () => {
      const dummyLoan: ILoan = {
        LoanId: 1,
        UserLoanNumber: 1,
        LoanAmount: 100000,
        InterestRate: 5,
        LoanTermYears: 30,
        ApplicationDate: '2023-05-01',
        ApprovalStatus: 'Approved',
      };
      const loanId = 1;

      service.getLoanById(loanId).subscribe((loan) => {
        expect(loan).toEqual(dummyLoan);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/loans/${loanId}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyLoan);
    });

    it('should handle non-existent loan id', () => {
      const nonExistentId = 9999;

      service.getLoanById(nonExistentId).subscribe(
        () => fail('should have failed with the 404 error'),
        (error: any) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      );

      const req = httpMock.expectOne(
        `${environment.apiUrl}/loans/${nonExistentId}`
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle invalid loan id', () => {
      const invalidId = -1;

      service.getLoanById(invalidId).subscribe(
        () => fail('should have failed with the 400 error'),
        (error: any) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
        }
      );

      const req = httpMock.expectOne(
        `${environment.apiUrl}/loans/${invalidId}`
      );
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  // Additional edge cases
  describe('edge cases', () => {
    it('should handle maximum loan amount', () => {
      const maxLoan: ILoan = {
        UserLoanNumber: 4,
        LoanAmount: Number.MAX_SAFE_INTEGER,
        InterestRate: 1,
        LoanTermYears: 50,
        ApplicationDate: '2023-05-04',
        ApprovalStatus: 'Pending',
      };

      service.createLoan(maxLoan).subscribe((loan) => {
        expect(loan.LoanAmount).toBe(Number.MAX_SAFE_INTEGER);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
      expect(req.request.method).toBe('POST');
      req.flush({ LoanId: 4, ...maxLoan });
    });

    it('should handle minimum loan term', () => {
      const minTermLoan: ILoan = {
        UserLoanNumber: 5,
        LoanAmount: 1000,
        InterestRate: 0.1,
        LoanTermYears: 1,
        ApplicationDate: '2023-05-05',
        ApprovalStatus: 'Approved',
      };

      service.createLoan(minTermLoan).subscribe((loan) => {
        expect(loan.LoanTermYears).toBe(1);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
      expect(req.request.method).toBe('POST');
      req.flush({ LoanId: 5, ...minTermLoan });
    });

    it('should handle zero interest rate', () => {
      const zeroInterestLoan: ILoan = {
        UserLoanNumber: 6,
        LoanAmount: 50000,
        InterestRate: 0,
        LoanTermYears: 10,
        ApplicationDate: '2023-05-06',
        ApprovalStatus: 'Approved',
      };

      service.createLoan(zeroInterestLoan).subscribe((loan) => {
        expect(loan.InterestRate).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
      expect(req.request.method).toBe('POST');
      req.flush({ LoanId: 6, ...zeroInterestLoan });
    });
  });
});
