import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { environment } from '../../environment/environment';
import { login } from '../../store/auth/auth.actions';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Store, useValue: storeSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storeMock = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch login action and make HTTP POST request with credentials', () => {
    const mockCredentials = { username: 'testuser', password: 'testpass' };
    const mockResponse = { token: 'mockToken', message: 'Login successful', username: 'testuser' };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);

    expect(storeMock.dispatch).toHaveBeenCalledWith(login({ credentials: mockCredentials }));
  });

  it('should handle empty credentials', () => {
    const emptyCredentials = { username: '', password: '' };

    service.login(emptyCredentials).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.body).toEqual(emptyCredentials);
    req.flush({});

    expect(storeMock.dispatch).toHaveBeenCalledWith(login({ credentials: emptyCredentials }));
  });

  it('should handle long username and password', () => {
    const longCredentials = { 
      username: 'a'.repeat(100), 
      password: 'b'.repeat(100) 
    };

    service.login(longCredentials).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.body).toEqual(longCredentials);
    req.flush({});

    expect(storeMock.dispatch).toHaveBeenCalledWith(login({ credentials: longCredentials }));
  });

  it('should handle special characters in credentials', () => {
    const specialCredentials = { 
      username: 'user@example.com', 
      password: 'p@ssw0rd!' 
    };

    service.login(specialCredentials).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.body).toEqual(specialCredentials);
    req.flush({});

    expect(storeMock.dispatch).toHaveBeenCalledWith(login({ credentials: specialCredentials }));
  });

  it('should handle server error', () => {
    const mockCredentials = { username: 'testuser', password: 'testpass' };
    const mockError = { status: 500, statusText: 'Internal Server Error' };

    service.login(mockCredentials).subscribe(
      () => fail('should have failed with the 500 error'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush('', mockError);

    expect(storeMock.dispatch).toHaveBeenCalledWith(login({ credentials: mockCredentials }));
  });

  it('should handle network error', () => {
    const mockCredentials = { username: 'testuser', password: 'testpass' };

    service.login(mockCredentials).subscribe(
      () => fail('should have failed with a network error'),
      (error) => {
        expect(error.name).toBe('HttpErrorResponse');
        expect(error.status).toBe(0);
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.error(new ErrorEvent('Network error', {
      message: 'simulated network error',
    }));

    expect(storeMock.dispatch).toHaveBeenCalledWith(login({ credentials: mockCredentials }));
  });
});

