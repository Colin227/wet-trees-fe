import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WateringCoverageComponent } from './watering-coverage.component';
import { DashboardService } from 'app/services/dashboard.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgApexchartsModule } from 'ng-apexcharts';

describe('WateringCoverageComponent', () => {
  let component: WateringCoverageComponent;
  let fixture: ComponentFixture<WateringCoverageComponent>;

  const mockCoverage = 75;

  const dashboardServiceMock = {
    getWateringCoverage: jasmine.createSpy().and.returnValue(
      of({ wateringCoverage: mockCoverage })
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WateringCoverageComponent, // standalone component
        MatCardModule,
        MatProgressSpinnerModule,
        NgApexchartsModule
      ],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WateringCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load watering coverage and set chart options', () => {
    expect(dashboardServiceMock.getWateringCoverage).toHaveBeenCalled();
    expect(component.chartOptions).toBeDefined();
    expect(component.chartOptions?.series).toEqual([mockCoverage]);
    expect(component.chartOptions?.labels).toEqual(['Zones Watered']);
  });
});
