import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WateringFormComponent } from './watering-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { of } from 'rxjs';
import { SitesService } from 'app/services/sites.service';
import { WateringsService } from 'app/services/waterings.service';
import { UserService } from 'app/services/user.service';
import { Site, WateringEvent } from '@models';

const mockSites: Site[] = [
  {
    id: 1,
    name: 'Site A',
    location: 'Location A',
    zones: []
  }
];

const mockWateringEvent: Partial<WateringEvent> = {
  id: 1,
  wateredAt: new Date().toISOString(),
  notes: 'Test notes',
  recordedBy: 'Test User',
  zone: { id: 1, name: 'Zone A', site: mockSites[0], trees: [], wateringEvents: [], environmentReadings: [], devices: [] }
};

const sitesServiceMock = {
  getAllSites: jasmine.createSpy().and.returnValue(of(mockSites))
};

const userServiceMock = {
  getFullName: jasmine.createSpy().and.returnValue('Test User')
};

const wateringsServiceMock = {
  createWatering: jasmine.createSpy().and.returnValue(of({})),
  updateWatering: jasmine.createSpy().and.returnValue(of({}))
};

const matDialogRefMock = {
  close: jasmine.createSpy()
};

describe('WateringFormComponent', () => {
  let component: WateringFormComponent;
  let fixture: ComponentFixture<WateringFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WateringFormComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatOptionModule,
        MatDatepickerModule
      ],
      providers: [
        provideNativeDateAdapter(),
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockWateringEvent },
        { provide: SitesService, useValue: sitesServiceMock },
        { provide: WateringsService, useValue: wateringsServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WateringFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize sites$ on ngOnInit', () => {
    component.ngOnInit();
    expect(sitesServiceMock.getAllSites).toHaveBeenCalled();
  });

  it('should close dialog on cancel click', () => {
    component.onCancelClick();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should call createWatering on submit in create mode', () => {
    component.isEditMode = false;
    component.form.patchValue({ zoneId: 1 });
    component.submit();
    expect(wateringsServiceMock.createWatering).toHaveBeenCalled();
  });

  it('should call updateWatering on submit in edit mode', () => {
    component.isEditMode = true;
    component.form.patchValue({ zoneId: 1 });
    component.submit();
    expect(wateringsServiceMock.updateWatering).toHaveBeenCalled();
  });
});
