import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TreeFormComponent } from './tree-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreesService } from 'app/services/trees.service';
import { ZonesService } from 'app/services/zones.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Tree } from '@models';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('TreeFormComponent', () => {
  let component: TreeFormComponent;
  let fixture: ComponentFixture<TreeFormComponent>;
  let mockTreeService: jasmine.SpyObj<TreesService>;
  let mockZonesService: jasmine.SpyObj<ZonesService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<TreeFormComponent>>;

  const mockZones = [
    { id: 1, name: 'Zone A', site: { id: 1, name: 'Site A', location: 'Loc A', zones: [] }, trees: [], wateringEvents: [], environmentReadings: [], devices: [] }
  ];

  beforeEach(async () => {
    mockTreeService = jasmine.createSpyObj('TreesService', ['createTree', 'updateTree']);
    mockZonesService = jasmine.createSpyObj('ZonesService', ['getAllZones']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [TreeFormComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        provideNativeDateAdapter(),
        { provide: TreesService, useValue: mockTreeService },
        { provide: ZonesService, useValue: mockZonesService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null } // overridden per test
      ]
    }).compileComponents();
  });

  describe('create mode', () => {
    beforeEach(() => {
      mockZonesService.getAllZones.and.returnValue(of(mockZones));
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
      fixture = TestBed.createComponent(TreeFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should call createTree when submitting in create mode', fakeAsync(() => {
      const mockTree: Tree = {
        id: 1,
        species: 'Maple',
        plantedAt: new Date().toISOString(),
        status: 'healthy',
        zone: mockZones[0],
        healthLogs: []
      };

      mockTreeService.createTree.and.returnValue(of(mockTree));
      component.form.patchValue({
        species: 'Maple',
        plantedAt: new Date(),
        status: 'healthy',
        zoneId: 1
      });

      component.submit();
      tick();

      expect(mockTreeService.createTree).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith(mockTree);
    }));
  });

  describe('edit mode', () => {
    beforeEach(() => {
      const editTree: Tree = {
        id: 42,
        species: 'Birch',
        plantedAt: new Date().toISOString(),
        status: 'unhealthy',
        zone: mockZones[0],
        healthLogs: []
      };

      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: editTree });
      fixture = TestBed.createComponent(TreeFormComponent);
      component = fixture.componentInstance;
      mockZonesService.getAllZones.and.returnValue(of(mockZones));
      fixture.detectChanges();
    });

    it('should call updateTree when submitting in edit mode', fakeAsync(() => {
      const updatedTree: Tree = {
        id: 42,
        species: 'Birch',
        plantedAt: new Date().toISOString(),
        status: 'healthy',
        zone: mockZones[0],
        healthLogs: []
      };

      mockTreeService.updateTree.and.returnValue(of(updatedTree));

      component.form.patchValue({
        species: 'Birch',
        plantedAt: new Date(),
        status: 'healthy',
        zoneId: 1
      });

      component.submit();
      tick();

      expect(mockTreeService.updateTree).toHaveBeenCalledWith(42, jasmine.any(Object));
      expect(mockDialogRef.close).toHaveBeenCalledWith(updatedTree);
    }));
  });
});
