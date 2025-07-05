import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnvironmentReadingsService } from './environment-readings.service';
import { EnvironmentReading } from '@models';
import { environment } from 'environments/environment';

describe('EnvironmentReadingsService', () => {
  let service: EnvironmentReadingsService;
  let httpMock: HttpTestingController;

  const mockReadings: EnvironmentReading[] = [
    {
      id: 1,
      temperature: 22.5,
      humidity: 45.2,
      moisture: 33.1,
      recordedAt: '2025-06-01T12:00:00Z',
      zone: { id: 1, name: 'Zone 1', site: { id: 1, name: 'Site A', location: 'North', zones: [] }, trees: [], wateringEvents: [], environmentReadings: [], devices: [] },
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnvironmentReadingsService]
    });

    service = TestBed.inject(EnvironmentReadingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all environment readings', () => {
    service.getAllReadings().subscribe((readings) => {
      expect(readings).toEqual(mockReadings);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/environment-readings`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReadings);
  });

  it('should fetch readings by device ID', () => {
    const deviceId = 'dev-123';

    service.getReadingsByDeviceId(deviceId).subscribe((readings) => {
      expect(readings).toEqual(mockReadings);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/environment-readings/device/${deviceId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReadings);
  });
});
