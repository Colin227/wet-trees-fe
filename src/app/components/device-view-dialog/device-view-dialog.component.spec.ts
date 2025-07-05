import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceViewDialogComponent } from './device-view-dialog.component';
import { EnvironmentReadingsService } from 'app/services/environment-readings.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { EnvironmentReading } from '@models';

describe('DeviceViewDialogComponent', () => {
  let component: DeviceViewDialogComponent;
  let fixture: ComponentFixture<DeviceViewDialogComponent>;
  let mockEnvironmentReadingsService: jasmine.SpyObj<EnvironmentReadingsService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeviceViewDialogComponent>>;

  const mockDevice = {
    id: 1,
    deviceId: 'abc-123',
    zone: null
  };

  const mockReadings: EnvironmentReading[] = [
    {
      id: 1,
      temperature: 20,
      humidity: 50,
      moisture: 30,
      recordedAt: new Date().toISOString(),
      zone: {
        id: 1,
        name: 'Test Zone',
        site: { id: 1, name: 'Test Site', location: '', zones: [] },
        trees: [],
        devices: [],
        wateringEvents: [],
        environmentReadings: []
      }
    }
  ];

  beforeEach(async () => {
    mockEnvironmentReadingsService = jasmine.createSpyObj('EnvironmentReadingsService', ['getReadingsByDeviceId']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [DeviceViewDialogComponent],
      providers: [
        { provide: EnvironmentReadingsService, useValue: mockEnvironmentReadingsService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDevice }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceViewDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load environment readings and set chart options', () => {
    mockEnvironmentReadingsService.getReadingsByDeviceId.and.returnValue(of(mockReadings));

    fixture.detectChanges(); // triggers ngOnInit

    expect(mockEnvironmentReadingsService.getReadingsByDeviceId).toHaveBeenCalledWith(mockDevice.deviceId);

    component.readings$.subscribe(readings => {
      expect(readings.length).toBe(1);
      expect(readings[0].temperature).toBe(20);
    });

    expect(component.chartOptions).toBeTruthy();
    expect(component.chartOptions?.series?.length).toBe(3); // temperature, humidity, moisture
  });
});
