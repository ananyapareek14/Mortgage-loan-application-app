import { TestBed } from '@angular/core/testing';
import { InterestRateService } from './interest-rate.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IInterestRate } from '../../models/IInterestRate';
import { environment } from '../../environment/environment';

describe('Interest Rate Service', () => {
  let service: InterestRateService;
  let httpMock: HttpTestingController;

  const mockRates: IInterestRate[] = [
    {
      Id: 'rate-1',
      Rate: 5.5,
      ValidFrom: '2024-01-01'
    }
  ];
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InterestRateService]
    });

    service = TestBed.inject(InterestRateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch interest rates', () => {
    service.getInterestRate().subscribe(rates => {
      expect(rates).toEqual(mockRates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/interestrates`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRates);
  });
});
