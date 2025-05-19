import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtToIncomeComponent } from './debt-to-income.component';

describe('DebtToIncomeComponent', () => {
  let component: DebtToIncomeComponent;
  let fixture: ComponentFixture<DebtToIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtToIncomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtToIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
