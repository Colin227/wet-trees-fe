import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteFormComponent } from './site-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SitesService } from 'app/services/sites.service';
import { Site } from '@models';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('SiteFormComponent', () => {
  let component: SiteFormComponent;
  let fixture: ComponentFixture<SiteFormComponent>;
  let mockSitesService: jasmine.SpyObj<SitesService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<SiteFormComponent>>;

  const mockSite: Site = {
    id: 1,
    name: 'Test Site',
    location: 'Test Location',
    zones: []
  };

  beforeEach(async () => {
    mockSitesService = jasmine.createSpyObj('SitesService', ['createSite', 'updateSite']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [SiteFormComponent, ReactiveFormsModule],
      providers: [
        { provide: SitesService, useValue: mockSitesService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null } // Change for edit mode test
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.form.setValue({ id: null, name: '', location: '' });
    component.submit();
    expect(mockSitesService.createSite).not.toHaveBeenCalled();
    expect(mockSitesService.updateSite).not.toHaveBeenCalled();
  });

  it('should call createSite and close dialog when creating a site', () => {
    const mockCreatedSite = { ...mockSite, id: 2 };
    mockSitesService.createSite.and.returnValue(of(mockCreatedSite));

    component.form.setValue({ id: null, name: 'New Site', location: 'Somewhere' });
    component.isEditMode = false;
    component.submit();

    expect(mockSitesService.createSite).toHaveBeenCalledWith({
      name: 'New Site',
      location: 'Somewhere'
    });
    expect(mockDialogRef.close).toHaveBeenCalledWith(mockCreatedSite);
  });

  it('should call updateSite and close dialog in edit mode', () => {
    const updatedSite = { ...mockSite, name: 'Updated Site' };

    // Recreate with MAT_DIALOG_DATA set to simulate edit mode
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SiteFormComponent, ReactiveFormsModule],
      providers: [
        { provide: SitesService, useValue: mockSitesService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: updatedSite }
      ]
    });

    fixture = TestBed.createComponent(SiteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockSitesService.updateSite.and.returnValue(of(updatedSite));
    component.form.setValue({
      id: updatedSite.id,
      name: updatedSite.name,
      location: updatedSite.location
    });
    component.submit();

    expect(mockSitesService.updateSite).toHaveBeenCalledWith(updatedSite.id, {
      name: updatedSite.name,
      location: updatedSite.location
    });
    expect(mockDialogRef.close).toHaveBeenCalledWith(updatedSite);
  });

  it('should log error on createSite failure', () => {
    spyOn(console, 'error');
    mockSitesService.createSite.and.returnValue(throwError(() => new Error('Create failed')));

    component.form.setValue({ id: null, name: 'New Site', location: 'Errorville' });
    component.isEditMode = false;
    component.submit();

    expect(console.error).toHaveBeenCalledWith('Error creating site:', jasmine.any(Error));
  });

  it('should log error on updateSite failure', () => {
    spyOn(console, 'error');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SiteFormComponent, ReactiveFormsModule],
      providers: [
        { provide: SitesService, useValue: mockSitesService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockSite }
      ]
    });

    fixture = TestBed.createComponent(SiteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockSitesService.updateSite.and.returnValue(throwError(() => new Error('Update failed')));
    component.form.setValue({
      id: mockSite.id,
      name: mockSite.name,
      location: mockSite.location
    });
    component.submit();

    expect(console.error).toHaveBeenCalledWith('Error updating site:', jasmine.any(Error));
  });
});
