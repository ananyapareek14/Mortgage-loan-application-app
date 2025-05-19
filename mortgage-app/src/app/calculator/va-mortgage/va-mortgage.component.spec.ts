import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaMortgageComponent } from './va-mortgage.component';

describe('VaMortgageComponent', () => {
  let component: VaMortgageComponent;
  let fixture: ComponentFixture<VaMortgageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaMortgageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaMortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
