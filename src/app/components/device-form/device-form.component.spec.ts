import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DeviceFormComponent } from './device-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceService } from 'app/services/device.service';
import { SitesService } from 'app/services/sites.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Device } from '@models';

describe('DeviceFormComponent', () => {
  let component: DeviceFormComponent;
  let fixture: ComponentFixture<DeviceFormComponent>;

  let mockDevice: Device;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<DeviceFormComponent>>;
  let deviceServiceMock: jasmine.SpyObj<DeviceService>;
  let sitesServiceMock: jasmine.SpyObj<SitesService>;

  beforeEach(async () => {
    mockDevice = {
      id: 1,
      deviceId: 'device123',
      zone: {
        id: 1,
        name: 'Zone 1',
        site: {
          id: 1,
          name: 'Site A',
          location: 'Location A',
          zones: []
        },
        trees: [],
        wateringEvents: [],
        environmentReadings: [],
        devices: []
      },
      config: {}
    };

    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    deviceServiceMock = jasmine.createSpyObj('DeviceService', ['updateDevice', 'createDevice']);
    sitesServiceMock = jasmine.createSpyObj('SitesService', ['getAllSites']);

    deviceServiceMock.updateDevice.and.returnValue(of(mockDevice));
    deviceServiceMock.createDevice.and.returnValue(of(mockDevice));
    sitesServiceMock.getAllSites.and.returnValue(of([mockDevice.zone.site]));

    await TestBed.configureTestingModule({
      imports: [DeviceFormComponent, ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDevice },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: DeviceService, useValue: deviceServiceMock },
        { provide: SitesService, useValue: sitesServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sites on init and disable deviceId in edit mode', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(sitesServiceMock.getAllSites).toHaveBeenCalled();
    expect(component.form.get('deviceId')?.disabled).toBeTrue();
  }));

  it('should update device in edit mode', fakeAsync(() => {
    component.isEditMode = true;
    component.form.patchValue({ zone: 1 });
    component.submit();
    tick();
    expect(deviceServiceMock.updateDevice).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalledWith(mockDevice);
  }));

  it('should create device in create mode', fakeAsync(() => {
    component.isEditMode = false;
    component.form.get('deviceId')?.enable();
    component.form.patchValue({ deviceId: 'new-device', zone: 1 });
    component.submit();
    tick();
    expect(deviceServiceMock.createDevice).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalledWith(mockDevice);
  }));

  it('should not submit if form is invalid', fakeAsync(() => {
    component.form.patchValue({ deviceId: '', zone: null });
    component.submit();
    tick();
    expect(deviceServiceMock.createDevice).not.toHaveBeenCalled();
    expect(deviceServiceMock.updateDevice).not.toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  }));

  it('should close dialog on cancel click', () => {
    component.onCancelClick();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
