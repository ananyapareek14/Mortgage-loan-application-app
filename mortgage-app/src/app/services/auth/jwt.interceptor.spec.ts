import { TestBed } from '@angular/core/testing';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  let interceptor: jwtInterceptor;
  let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [jwtInterceptor],
    });
    interceptor = TestBed.inject(jwtInterceptor);
    httpHandlerSpy = jasmine.createSpyObj<HttpHandler>('HttpHandler', [
      'handle',
    ]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when token exists', () => {
    const token = 'test-token';
    localStorage.setItem('auth', JSON.stringify({ token }));
    const request = new HttpRequest('GET', '/api/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          get: jasmine.any(Function),
        }),
      })
    );

    const modifiedRequest = httpHandlerSpy.handle.calls.first()
      .args[0] as HttpRequest<any>;
    expect(modifiedRequest.headers.get('Authorization')).toBe(
      `Bearer ${token}`
    );
  });

  it('should not add Authorization header when token does not exist', () => {
    const request = new HttpRequest('GET', '/api/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(request);
    expect(request.headers.has('Authorization')).toBeFalsy();
  });

  it('should handle malformed JSON in localStorage', () => {
    localStorage.setItem('auth', 'invalid-json');
    const request = new HttpRequest('GET', '/api/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(request);
    expect(request.headers.has('Authorization')).toBeFalsy();
  });

  it('should handle empty token in localStorage', () => {
    localStorage.setItem('auth', JSON.stringify({ token: '' }));
    const request = new HttpRequest('GET', '/api/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(request);
    expect(request.headers.has('Authorization')).toBeFalsy();
  });

  it('should handle null token in localStorage', () => {
    localStorage.setItem('auth', JSON.stringify({ token: null }));
    const request = new HttpRequest('GET', '/api/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(request);
    expect(request.headers.has('Authorization')).toBeFalsy();
  });

  it('should preserve existing headers when adding Authorization', () => {
    const token = 'test-token';
    localStorage.setItem('auth', JSON.stringify({ token }));
    const request = new HttpRequest('GET', '/api/test', null, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, httpHandlerSpy);

    const modifiedRequest = httpHandlerSpy.handle.calls.first()
      .args[0] as HttpRequest<any>;
    expect(modifiedRequest.headers.get('Content-Type')).toBe(
      'application/json'
    );
    expect(modifiedRequest.headers.get('Authorization')).toBe(
      `Bearer ${token}`
    );
  });

  it('should handle requests with different HTTP methods', () => {
    const token = 'test-token';
    localStorage.setItem('auth', JSON.stringify({ token }));

    type HttpMethod =
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'DELETE'
      | 'OPTIONS'
      | 'HEAD'
      | 'PATCH'
      | 'JSONP';

    const methods: HttpMethod[] = ['GET', 'POST'];

    methods.forEach((method) => {
      const request = new HttpRequest<any>(method as any, '/api/test');
      httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

      interceptor.intercept(request, httpHandlerSpy).subscribe();

      const modifiedRequest = httpHandlerSpy.handle.calls.mostRecent()
        .args[0] as HttpRequest<any>;

      expect(modifiedRequest.headers.get('Authorization')).toBe(
        `Bearer ${token}`
      );
    });
  });

  // Additional tests for edge cases

  it('should handle undefined auth in localStorage', () => {
    localStorage.removeItem('auth');
    const request = new HttpRequest('GET', '/api/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(request);
    expect(request.headers.has('Authorization')).toBeFalsy();
  });

  it('should handle auth object without token property', () => {
    localStorage.setItem(
      'auth',
      JSON.stringify({ someOtherProperty: 'value' })
    );
    const request = new HttpRequest('GET', '/api/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(request);
    expect(request.headers.has('Authorization')).toBeFalsy();
  });

  it('should not modify the original request object', () => {
    const token = 'test-token';
    localStorage.setItem('auth', JSON.stringify({ token }));
    const originalRequest = new HttpRequest('GET', '/api/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(originalRequest, httpHandlerSpy);

    expect(originalRequest.headers.has('Authorization')).toBeFalsy();
    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          get: jasmine.any(Function),
        }),
      })
    );
  });
});
