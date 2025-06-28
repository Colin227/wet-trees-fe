import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WateringCoverageComponent } from './watering-coverage.component';

describe('WateringCoverageComponent', () => {
  let component: WateringCoverageComponent;
  let fixture: ComponentFixture<WateringCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WateringCoverageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WateringCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
