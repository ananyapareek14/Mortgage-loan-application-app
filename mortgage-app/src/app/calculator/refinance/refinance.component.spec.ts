import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefinanceComponent } from './refinance.component';

describe('RefinanceComponent', () => {
  let component: RefinanceComponent;
  let fixture: ComponentFixture<RefinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
