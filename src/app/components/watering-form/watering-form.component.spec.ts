import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WateringFormComponent } from './watering-form.component';

describe('WateringFormComponent', () => {
  let component: WateringFormComponent;
  let fixture: ComponentFixture<WateringFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WateringFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WateringFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
