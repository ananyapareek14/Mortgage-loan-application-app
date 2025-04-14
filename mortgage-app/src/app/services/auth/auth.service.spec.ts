import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import ILogin, { ILoginCredentials } from '../../models/IAuth';
import { environment } from '../../environment/environment';
import { login } from '../../store/auth/auth.actions';

describe('Auth Service', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: Store;

  const mockCredentials: ILoginCredentials = {
    username: 'user@example.com',
    password: 'password123'
  };

  const mockLoginResponse: ILogin = {
    token: 'mock-jwt-token',
    username: 'user@example.com',
    message: 'Login successful'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, provideMockStore()]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch'); // Watch for dispatch
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should dispatch login and call login endpoint', () => {
    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockLoginResponse);
    });

    expect(store.dispatch).toHaveBeenCalledWith(login({ credentials: mockCredentials }));

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);

    req.flush(mockLoginResponse);
  });
});
