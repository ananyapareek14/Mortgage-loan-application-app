import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthState } from '../../store/auth/auth.state';
import { selectAuthToken } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) { }

  // canActivate(): Observable<boolean> {
  //   return this.store.select(selectAuthToken).pipe(
  //     take(1),
  //     map(token => {
  //       // fallback in case store hasn't restored yet
  //       const savedAuth = localStorage.getItem('auth');
  //       const savedToken = savedAuth ? JSON.parse(savedAuth).token : null;
  //       const finalToken = token || savedToken;

  //       if (finalToken) {
  //         return true;
  //       } else {
  //         this.router.navigate(['/']);
  //         return false;
  //       }
  //     })
  //   );
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(selectAuthToken).pipe(
      take(1),
      map(token => {
        const savedAuth = localStorage.getItem('auth');
        const savedToken = savedAuth ? JSON.parse(savedAuth).token : null;
        const finalToken = token || savedToken;
  
        if (finalToken) {
          return true;
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }
}
