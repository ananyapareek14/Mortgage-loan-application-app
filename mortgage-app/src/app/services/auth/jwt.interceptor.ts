import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { first, Observable, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectToken } from '../../state/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
// export class jwtInterceptor implements HttpInterceptor {
//   constructor(private auth: AuthService) {}

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const token = this.auth.getAuthToken();

//     if (token) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     }
//     return next.handle(request);
//   }
// }











export class jwtInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select(selectToken).pipe(
      first(), // Ensure we get only the first emitted value
      switchMap((token) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        return next.handle(request);
      })
    );
  }
}
