import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ZoneFormComponent } from './zone-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ZonesService } from 'app/services/zones.service';
import { SitesService } from 'app/services/sites.service';
import { Zone } from '@models';

describe('ZoneFormComponent', () => {
  let component: ZoneFormComponent;
  let fixture: ComponentFixture<ZoneFormComponent>;

  const mockSites = [
    { id: 1, name: 'Site A', location: 'Somewhere', siteId: 1, zones: [] }
  ];


  let dialogRefMock: jasmine.SpyObj<MatDialogRef<ZoneFormComponent>>;
  let zonesServiceMock: jasmine.SpyObj<ZonesService>;
  let sitesServiceMock: jasmine.SpyObj<SitesService>;

  // const dialogRefMock = {
  //   close: jasmine.createSpy('close')
  // };

  // const zonesServiceMock = {
  //   createZone: jasmine.createSpy().and.returnValue(of({ id: 1, name: 'New Zone', site: mockSites[0], trees: [], wateringEvents: [], environmentReadings: [], devices: [] })),
  //   updateZone: jasmine.createSpy().and.returnValue(of({ id: 1, name: 'Updated Zone', site: mockSites[0], trees: [], wateringEvents: [], environmentReadings: [], devices: [] }))
  // };

  // const sitesServiceMock = {
  //   getAllSites: jasmine.createSpy().and.returnValue(of(mockSites))
  // };

  beforeEach(async () => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    zonesServiceMock = jasmine.createSpyObj('ZonesService', ['createZone', 'updateZone']);
    sitesServiceMock = jasmine.createSpyObj('SitesService', ['getAllSites']);

    zonesServiceMock.createZone.and.returnValue(of({
      id: 1, name: 'New Zone', site: mockSites[0],
      trees: [], wateringEvents: [], environmentReadings: [], devices: []
    }));

    zonesServiceMock.updateZone.and.returnValue(of({
      id: 1, name: 'Updated Zone', site: mockSites[0],
      trees: [], wateringEvents: [], environmentReadings: [], devices: []
    }));

    sitesServiceMock.getAllSites.and.returnValue(of(mockSites));


    await TestBed.configureTestingModule({
      imports: [ZoneFormComponent, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, site: mockSites[0] } },
        { provide: ZonesService, useValue: zonesServiceMock },
        { provide: SitesService, useValue: sitesServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ZoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with site from injected data', fakeAsync(() => {
    fixture.detectChanges();
    tick()
    console.log("component form: ", component.form.value)
    expect(component.form.get('siteId')?.value).toBe(1);
  }));

  it('should call createZone and close dialog on submit when not in edit mode', fakeAsync(() => {
    component.form.patchValue({ name: 'Zone 1', siteId: 1 });
    component.isEditMode = false;
    component.submit();
    tick();
    expect(zonesServiceMock.createZone).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  }));

  it('should call updateZone and close dialog on submit when in edit mode', fakeAsync(() => {
    component.isEditMode = true;
    component.form.patchValue({ id: 1, name: 'Updated Zone', siteId: 1 });
    component.submit();
    tick();
    expect(zonesServiceMock.updateZone).toHaveBeenCalledWith(1, jasmine.any(Object));
    expect(dialogRefMock.close).toHaveBeenCalled();
  }));

  it('should not submit if form is invalid', fakeAsync(() => {
    component.form.patchValue({ name: null, siteId: null });
    component.submit();
    tick();
    expect(zonesServiceMock.createZone).not.toHaveBeenCalled();
    expect(zonesServiceMock.updateZone).not.toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  }));

  it('should close dialog on cancel click', () => {
    component.onCancelClick();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
