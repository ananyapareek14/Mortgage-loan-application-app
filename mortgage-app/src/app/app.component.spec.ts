import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { loginSuccess } from './store/auth/auth.actions';
import { of, Subject } from 'rxjs';

describe('App Component', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the navbar on /login route', () => {
    routerEvents$.next(new NavigationEnd(1, '/redirect', '/login'));
    expect(component.hideNavbar).toBeTrue();
  });

  it('should show the navbar on non-login route', () => {
    routerEvents$.next(new NavigationEnd(1, '/redirect', '/dashboard'));
    expect(component.hideNavbar).toBeFalse();
  });

  it('should dispatch loginSuccess if auth data exists in localStorage', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const mockAuth = {
      token: 'mockToken',
      username: 'john',
    };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockAuth));

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(loginSuccess(mockAuth));
  });

  it('should not dispatch loginSuccess if auth data is missing', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(localStorage, 'getItem').and.returnValue(null);

    component.ngOnInit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should return route animation data', () => {
    const mockOutlet: any = {
      activatedRouteData: { animation: 'fade' },
    };
    const animation = component.getRouteAnimationData(mockOutlet);
    expect(animation).toBe('fade');
  });
});
