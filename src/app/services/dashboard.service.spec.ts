import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardStats, WateringCoverage } from '@models';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  const mockStats: DashboardStats = {
    totalTrees: 320,
    treesNeedingAttention: 10,
    totalSites: 5,
    totalZones: 12,
    recentWaterings: 100
  };

  const mockCoverage: WateringCoverage = {
    wateringCoverage: 85
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dashboard stats', () => {
    service.getStats().subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });

    const req = httpMock.expectOne('/api/dashboard/stats');
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('should fetch watering coverage', () => {
    service.getWateringCoverage().subscribe(coverage => {
      expect(coverage).toEqual(mockCoverage);
    });

    const req = httpMock.expectOne('/api/dashboard/wateringCoverage');
    expect(req.request.method).toBe('GET');
    req.flush(mockCoverage);
  });
});
