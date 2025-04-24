import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { InterestRateService } from './interest-rate.service';
import { environment } from '../../environment/environment';
import { IInterestRate } from '../../models/IInterestRate';

describe('Interest-Rate Service', () => {
  let service: InterestRateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InterestRateService],
    });
    service = TestBed.inject(InterestRateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve interest rates from the API', () => {
    const mockRates: IInterestRate[] = [
      { Id: '1', Rate: 5.5, ValidFrom: '2023-01-01' },
      { Id: '2', Rate: 6.0, ValidFrom: '2023-02-01' },
    ];

    service.getInterestRate().subscribe((rates) => {
      expect(rates.length).toBe(2);
      expect(rates).toEqual(mockRates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRates);
  });

  it('should handle empty response', () => {
    service.getInterestRate().subscribe((rates) => {
      expect(rates.length).toBe(0);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    req.flush([]);
  });

  it('should handle large number of interest rates', () => {
    const mockRates: IInterestRate[] = Array(1000)
      .fill(null)
      .map((_, index) => ({
        Id: (index + 1).toString(),
        Rate: Math.random() * 10,
        ValidFrom: new Date(2023, 0, index + 1).toISOString().split('T')[0],
      }));

    service.getInterestRate().subscribe((rates) => {
      expect(rates.length).toBe(1000);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    req.flush(mockRates);
  });

  it('should handle network error', () => {
    const errorMessage = 'Network error';

    service.getInterestRate().subscribe(
      () => fail('should have failed with the network error'),
      (error: Error) => {
        expect(error.message).toContain(errorMessage);
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    req.error(
      new ErrorEvent('Network error', {
        message: errorMessage,
      })
    );
  });

  it('should handle API returning non-array data', () => {
    service.getInterestRate().subscribe(
      () => fail('should have failed with invalid data'),
      (error: Error) => {
        expect(error.message).toContain('Invalid data structure');
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    req.flush({ invalidData: true }); // Non-array response
  });

  it('should handle API returning invalid interest rate objects', () => {
    const invalidRates = [
      { Id: '1', Rate: 5.5 }, // missing ValidFrom
      { Id: '2', ValidFrom: '2023-01-01' }, // missing Rate
      { Rate: 5.5, ValidFrom: '2023-01-01' }, // missing Id
      { Id: 3, Rate: 'invalid', ValidFrom: '2023-01-01' }, // invalid types
    ];

    service.getInterestRate().subscribe(
      () => fail('should have failed with invalid data'),
      (error: Error) => {
        expect(error.message).toContain('Invalid interest rate data');
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    req.flush(invalidRates);
  });

  // New edge cases
  it('should handle interest rates with future ValidFrom dates', () => {
    const futureRates: IInterestRate[] = [
      { Id: '1', Rate: 5.5, ValidFrom: '2025-01-01' },
      { Id: '2', Rate: 6.0, ValidFrom: '2024-06-01' },
    ];

    service.getInterestRate().subscribe((rates) => {
      expect(rates.length).toBe(2);
      expect(rates).toEqual(futureRates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    req.flush(futureRates);
  });

  it('should handle interest rates with very high or low rates', () => {
    const extremeRates: IInterestRate[] = [
      { Id: '1', Rate: 0.01, ValidFrom: '2023-01-01' },
      { Id: '2', Rate: 100, ValidFrom: '2023-01-02' },
    ];

    service.getInterestRate().subscribe((rates) => {
      expect(rates.length).toBe(2);
      expect(rates).toEqual(extremeRates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    req.flush(extremeRates);
  });

  it('should handle interest rates with duplicate IDs', () => {
    const duplicateIdRates: IInterestRate[] = [
      { Id: '1', Rate: 5.5, ValidFrom: '2023-01-01' },
      { Id: '1', Rate: 6.0, ValidFrom: '2023-02-01' },
    ];

    service.getInterestRate().subscribe((rates) => {
      expect(rates.length).toBe(2);
      expect(rates).toEqual(duplicateIdRates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    req.flush(duplicateIdRates);
  });
});