import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestReadingCardComponent } from './latest-reading-card.component';

describe('LatestReadingCardComponent', () => {
  let component: LatestReadingCardComponent;
  let fixture: ComponentFixture<LatestReadingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestReadingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestReadingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
