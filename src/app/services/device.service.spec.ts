import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeviceService } from './device.service';
import { CreateDeviceDto, Device, UpdateDeviceDto } from 'app/models/devices';
import { environment } from 'environments/environment';

describe('DeviceService', () => {
  let service: DeviceService;
  let httpMock: HttpTestingController;

  const mockDevice: Device = {
    id: 1,
    deviceId: 'abc123',
    zone: { id: 1, name: 'Zone 1', site: { id: 1, name: 'Site A', location: 'North', zones: [] }, trees: [], wateringEvents: [], environmentReadings: [], devices: [] },
    config: {}
  };

  const createDto: CreateDeviceDto = {
    deviceId: 'abc123',
    zoneId: 1
  };

  const updateDto: UpdateDeviceDto = {
    deviceId: 'abc123',
    zoneId: 2,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeviceService]
    });

    service = TestBed.inject(DeviceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all devices', () => {
    service.getAllDevices().subscribe(devices => {
      expect(devices).toEqual([mockDevice]);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/devices`);
    expect(req.request.method).toBe('GET');
    req.flush([mockDevice]);
  });

  it('should create a new device', () => {
    service.createDevice(createDto).subscribe(device => {
      expect(device).toEqual(mockDevice);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/devices`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createDto);
    req.flush(mockDevice);
  });

  it('should update a device', () => {
    service.updateDevice(updateDto).subscribe(device => {
      expect(device).toEqual(mockDevice);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/devices/${updateDto.deviceId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateDto);
    req.flush(mockDevice);
  });
});
