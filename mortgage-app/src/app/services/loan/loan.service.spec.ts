import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LoanService } from './loan.service';
import { ILoan } from '../../models/ILoan';
import { environment } from '../../environment/environment';

describe('Loan Service', () => {
  let service: LoanService;
  let httpMock: HttpTestingController;

  const createMockLoan = (overrides: Partial<ILoan> = {}): ILoan => ({
    UserLoanNumber: 1,
    LoanAmount: 10000,
    InterestRate: 5.5,
    LoanTermYears: 10,
    ApplicationDate: '2024-01-01',
    ApprovalStatus: 'Pending',
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanService]
    });

    service = TestBed.inject(LoanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests
  });

  it('should fetch loans', () => {
    const dummyLoans: ILoan[] = [
      createMockLoan(),
      createMockLoan({ UserLoanNumber: 2, LoanAmount: 15000 })
    ];

    service.getLoans().subscribe(loans => {
      expect(loans.length).toBe(2);
      expect(loans).toEqual(dummyLoans);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLoans); // Simulate API response
  });

  it('should create a new loan', () => {
    const newLoan = createMockLoan();
    
    service.createLoan(newLoan).subscribe(createdLoan => {
      expect(createdLoan).toEqual(newLoan);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/loans`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newLoan);
    req.flush(newLoan);
  });

  it('should fetch a loan by ID', () => {
    const loanId = 1;
    const expectedLoan = createMockLoan({ UserLoanNumber: loanId });

    service.getLoanById(loanId).subscribe(loan => {
      expect(loan).toEqual(expectedLoan);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/loans/${loanId}`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedLoan);
  });
});
