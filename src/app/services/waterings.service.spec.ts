import { TestBed } from '@angular/core/testing';
import { WateringsService } from './waterings.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateWateringDto, WateringEvent } from '@models';
import { environment } from 'environments/environment';

describe('WateringsService', () => {
  let service: WateringsService;
  let httpMock: HttpTestingController;

  const mockWateringEvent: WateringEvent = {
    id: 1,
    wateredAt: new Date().toISOString(),
    notes: 'Routine watering',
    recordedBy: 'Alice Smith',
    zone: {
      id: 1,
      name: 'Zone 1',
      site: {
        id: 1,
        name: 'Site 1',
        location: 'Test Location',
        zones: []
      },
      trees: [],
      wateringEvents: [],
      environmentReadings: [],
      devices: []
    }
  };

  const createWateringDto: CreateWateringDto = {
    wateredAt: mockWateringEvent.wateredAt,
    notes: mockWateringEvent.notes,
    recordedBy: mockWateringEvent.recordedBy,
    zoneId: mockWateringEvent.zone.id
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WateringsService]
    });

    service = TestBed.inject(WateringsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all watering events', () => {
    service.getAllWaterings().subscribe(events => {
      expect(events).toEqual([mockWateringEvent]);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/watering-events`);
    expect(req.request.method).toBe('GET');
    req.flush([mockWateringEvent]);
  });

  it('should create a watering event', () => {
    service.createWatering(createWateringDto).subscribe(event => {
      expect(event).toEqual(mockWateringEvent);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/watering-events`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createWateringDto);
    req.flush(mockWateringEvent);
  });

  it('should update a watering event', () => {
    const updatedDto = { ...createWateringDto, notes: 'Updated notes' };

    service.updateWatering(mockWateringEvent.id, updatedDto).subscribe(event => {
      expect(event.notes).toBe('Updated notes');
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/watering-events/${mockWateringEvent.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedDto);
    req.flush({ ...mockWateringEvent, notes: 'Updated notes' });
  });

  it('should delete a watering event', () => {
    service.deleteWatering(mockWateringEvent.id).subscribe(result => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/watering-events/${mockWateringEvent.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
