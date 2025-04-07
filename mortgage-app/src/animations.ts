import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  group,
  sequence,
} from '@angular/animations';

export const slideIn = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateY(-20px)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
]);

export const slideOut = trigger('slideOut', [
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 })),
  ]),
]);

export const staggerList = trigger('staggerList', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(-20px)' }),
      stagger(100, [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ])
    ], { optional: true })
  ])
]);

export const chartSlideAnimation = trigger('chartSlideAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-100px)' }))
  ])
]);

export const routeAnimations = trigger('routeAnimations', [
  transition('LoginPage => DashboardPage', [
    slideToLeft()
  ]),
  transition('DashboardPage => LoginPage', [
    slideToRight()
  ]),
  transition('DashboardPage => AmortizationPage', [
    slideToLeft()
  ]),
  transition('DashboardPage => LoanApplicationPage', [
    slideToLeft()
  ]),
  transition('LoanDetailPage => AmortizationPage', [
    slideToLeft()
  ]),
  transition('LoanDetailPage => LoanApplicationPage', [
    slideToLeft()
  ]),
  transition('AmortizationPage => LoanApplicationPage', [
    slideToLeft()
  ]),
  transition('LoanApplicationPage => AmortizationPage', [
    slideToRight()
  ]),
  transition('LoanApplicationPage => DashboardPage', [
    slideToRight()
  ]),
  transition('AmortizationPage => DashboardPage', [
    slideToRight()
  ]),
]);

function slideToLeft() {
  return sequence([
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
      optional: true,
    }),
    group([
      query(':leave', [
        animate('300ms ease', style({ transform: 'translateX(-100%)' })),
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease', style({ transform: 'translateX(0%)' })),
      ], { optional: true }),
    ]),
  ]);
}

function slideToRight() {
  return sequence([
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), {
      optional: true,
    }),
    group([
      query(':leave', [
        animate('300ms ease', style({ transform: 'translateX(100%)' })),
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease', style({ transform: 'translateX(0%)' })),
      ], { optional: true }),
    ]),
  ]);
}