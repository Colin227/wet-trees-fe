import { TestBed } from '@angular/core/testing';
import { ZonesService } from './zones.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateZoneDto, Zone } from '@models';
import { environment } from 'environments/environment';

describe('ZonesService', () => {
  let service: ZonesService;
  let httpMock: HttpTestingController;

  const mockZone: Zone = {
    id: 1,
    name: 'Zone A',
    site: {
      id: 1,
      name: 'Site A',
      location: 'Somewhere',
      zones: []
    },
    trees: [],
    wateringEvents: [],
    environmentReadings: [],
    devices: []
  };

  const createZoneDto: CreateZoneDto = {
    name: 'Zone A',
    siteId: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ZonesService]
    });

    service = TestBed.inject(ZonesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all zones', () => {
    service.getAllZones().subscribe(zones => {
      expect(zones).toEqual([mockZone]);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/zones`);
    expect(req.request.method).toBe('GET');
    req.flush([mockZone]);
  });

  it('should create a zone', () => {
    service.createZone(createZoneDto).subscribe(zone => {
      expect(zone).toEqual(mockZone);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/zones`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createZoneDto);
    req.flush(mockZone);
  });

  it('should update a zone', () => {
    const updatedZone: Zone = { ...mockZone, name: 'Updated Zone' };

    service.updateZone(1, createZoneDto).subscribe(zone => {
      expect(zone).toEqual(updatedZone);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/zones/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(createZoneDto);
    req.flush(updatedZone);
  });

  it('should delete a zone', () => {
    service.deleteZone(1).subscribe(response => {
      expect(response).toBeNull(); // void return
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/zones/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch a zone by ID', () => {
    service.getZoneById(1).subscribe(zone => {
      expect(zone).toEqual(mockZone);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/zones/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockZone);
  });

  it('should fetch zones by site ID', () => {
    service.getZonesBySiteId(1).subscribe(zones => {
      expect(zones).toEqual([mockZone]);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/zones?siteId=1`);
    expect(req.request.method).toBe('GET');
    req.flush([mockZone]);
  });
});
