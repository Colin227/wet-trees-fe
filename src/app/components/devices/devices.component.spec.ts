import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DevicesComponent } from './devices.component';
import { of } from 'rxjs';
import { DeviceService } from 'app/services/device.service';
import { MatDialog } from '@angular/material/dialog';
import { Device } from 'app/models/devices';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('DevicesComponent', () => {
  let component: DevicesComponent;
  let fixture: ComponentFixture<DevicesComponent>;
  let mockDeviceService: jasmine.SpyObj<DeviceService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockDevices: Device[] = [
    { id: 1, deviceId: 'device-1', zone: { id: 1, name: 'Zone A', site: { id: 1, name: 'Site A', location: 'Loc', zones: [] }, devices: [], environmentReadings: [], trees: [], wateringEvents: [] }, config: {} },
    { id: 2, deviceId: 'device-2', zone: { id: 2, name: 'Zone B', site: { id: 1, name: 'Site A', location: 'Loc', zones: [] }, devices: [], environmentReadings: [], trees: [], wateringEvents: [] }, config: {} }
  ];

  beforeEach(async () => {
    mockDeviceService = jasmine.createSpyObj('DeviceService', ['getAllDevices']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [DevicesComponent, MatTableModule, MatButtonModule, MatIconModule],
      providers: [
        { provide: DeviceService, useValue: mockDeviceService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DevicesComponent);
    component = fixture.componentInstance;

    // Prevent error when table is not yet rendered in test DOM
    component.table = jasmine.createSpyObj('MatTable', ['renderRows']) as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load devices on init', fakeAsync(() => {
    mockDeviceService.getAllDevices.and.returnValue(of(mockDevices));
    fixture.detectChanges(); // triggers ngOnInit
    tick();

    expect(mockDeviceService.getAllDevices).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  }));

  it('should open dialog when creating device', () => {
    const afterClosed$ = of({ id: 3, deviceId: 'device-3' });
    mockDialog.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);
    mockDeviceService.getAllDevices.and.returnValue(of(mockDevices));

    component.createDevice();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should open dialog when editing device', () => {
    const afterClosed$ = of({ id: 1, deviceId: 'device-1' });
    mockDialog.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);
    mockDeviceService.getAllDevices.and.returnValue(of(mockDevices));

    component.editDevice(mockDevices[0]);

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should open dialog when viewing device', () => {
    mockDialog.open.and.returnValue({} as any);

    component.viewDevice(mockDevices[0]);

    expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
      data: mockDevices[0],
      width: '900px',
      height: '500px'
    }));
  });

  it('should log device on delete (placeholder)', () => {
    spyOn(console, 'log');
    component.deleteDevice(mockDevices[0]);
    expect(console.log).toHaveBeenCalledWith('TODO: Delete device ', mockDevices[0]);
  });
});
