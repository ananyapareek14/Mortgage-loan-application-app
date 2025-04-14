import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

describe('Jwt Interceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  let getItemSpy: jasmine.Spy;

  beforeEach(() => {
    // Setup the spy once in beforeEach
    getItemSpy = spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ token: 'mock-jwt-token' })
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: jwtInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Reset the spy to avoid interference between tests
    getItemSpy.calls.reset();
    httpMock.verify();
  });

  it('should add Authorization header if token is available', () => {
    httpClient.get('/test-endpoint').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-jwt-token');
    req.flush({});
  });

  it('should not add Authorization header if no token', () => {
    // Modify the spy to simulate no token in localStorage
    getItemSpy.and.returnValue(null);

    httpClient.get('/test-endpoint').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
