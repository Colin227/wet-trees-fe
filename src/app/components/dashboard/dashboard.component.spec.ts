import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
import { DashboardService } from 'app/services/dashboard.service';
import { SocketService } from 'app/services/socket.service';
import { DashboardStats, EnvironmentReading } from '@models';
import { DatePipe } from '@angular/common';

// Mock data
const mockStats: DashboardStats = {
  totalTrees: 50,
  treesNeedingAttention: 10,
  totalZones: 5,
  totalSites: 3,
  recentWaterings: 20
};

const mockReading: EnvironmentReading = {
  id: 1,
  temperature: 22.5,
  humidity: 60,
  moisture: 35,
  recordedAt: new Date().toISOString(),
  zone: {
    id: 1,
    name: 'Zone A',
    site: {
      id: 1,
      name: 'Site A',
      location: 'Location A',
      zones: []
    },
    devices: [],
    environmentReadings: [],
    trees: [],
    wateringEvents: []
  }
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;
  let mockSocketService: jasmine.SpyObj<SocketService>;

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj('DashboardService', ['getStats', 'getWateringCoverage']);
    mockSocketService = jasmine.createSpyObj('SocketService', ['getLatestReading']);

    mockDashboardService.getStats.and.returnValue(of(mockStats));
    mockDashboardService.getWateringCoverage.and.returnValue(of({ wateringCoverage: 100 }));
    mockSocketService.getLatestReading.and.returnValue(of(mockReading));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        DatePipe,
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: SocketService, useValue: mockSocketService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard stats and initialize chart options', () => {    

    fixture.detectChanges(); // triggers ngOnInit

    expect(mockDashboardService.getStats).toHaveBeenCalled();
    expect(component.stats).toEqual(mockStats);
    expect(component.chartOptions).toBeDefined();
    expect(component.chartOptions?.series).toEqual([mockStats.totalTrees, mockStats.treesNeedingAttention]);
  });

  it('should expose latest reading observable', (done) => {
    fixture.detectChanges();

    component.latestReading$.subscribe(reading => {
      expect(reading).toEqual(mockReading);
      done();
    });
  });
});
