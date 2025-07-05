import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WateringsComponent } from './waterings.component';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { WateringsService } from 'app/services/waterings.service';
import { WateringEvent } from '@models';
import { DatePipe } from '@angular/common';

describe('WateringsComponent', () => {
  let component: WateringsComponent;
  let fixture: ComponentFixture<WateringsComponent>;
  let mockWateringsService: jasmine.SpyObj<WateringsService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockWaterings: WateringEvent[] = [
    {
      id: 1,
      wateredAt: new Date().toISOString(),
      notes: 'Test watering',
      recordedBy: 'Tester',
      zone: {
        id: 1,
        name: 'Zone A',
        site: {
          id: 1,
          name: 'Site A',
          location: 'Location A',
          zones: []
        },
        devices: [],
        environmentReadings: [],
        trees: [],
        wateringEvents: []
      }
    }
  ];

  beforeEach(async () => {
    mockWateringsService = jasmine.createSpyObj('WateringsService', [
      'getAllWaterings',
      'deleteWatering'
    ]);

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [WateringsComponent],
      providers: [
        DatePipe,
        { provide: WateringsService, useValue: mockWateringsService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WateringsComponent);
    component = fixture.componentInstance;

    // Prevent error when table is not yet rendered in test DOM
    component.table = jasmine.createSpyObj('MatTable', ['renderRows']) as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load waterings on init', () => {
    mockWateringsService.getAllWaterings.and.returnValue(of(mockWaterings));

    fixture.detectChanges();

    expect(mockWateringsService.getAllWaterings).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockWaterings);
  });

  it('should open create dialog and reload on success', () => {
    const mockDialogRef = {
      afterClosed: () => of(mockWaterings[0])
    } as any;

    mockDialog.open.and.returnValue(mockDialogRef);
    mockWateringsService.getAllWaterings.and.returnValue(of(mockWaterings));

    component.createWatering();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockWateringsService.getAllWaterings).toHaveBeenCalled();
  });

  it('should open edit dialog and reload on success', () => {
    const mockDialogRef = {
      afterClosed: () => of(mockWaterings[0])
    } as any;

    mockDialog.open.and.returnValue(mockDialogRef);
    mockWateringsService.getAllWaterings.and.returnValue(of(mockWaterings));

    component.editWatering(mockWaterings[0]);

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockWateringsService.getAllWaterings).toHaveBeenCalled();
  });

  it('should delete watering after confirmation', () => {
    const mockDialogRef = {
      afterClosed: () => of(true)
    } as any;

    mockDialog.open.and.returnValue(mockDialogRef);
    mockWateringsService.deleteWatering.and.returnValue(of(void 0));
    mockWateringsService.getAllWaterings.and.returnValue(of(mockWaterings));

    component.deleteWatering(mockWaterings[0]);

    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockWateringsService.deleteWatering).toHaveBeenCalledWith(mockWaterings[0].id);
    expect(mockWateringsService.getAllWaterings).toHaveBeenCalled();
  });

  it('should handle delete watering error', () => {
    spyOn(console, 'error');
    const mockDialogRef = {
      afterClosed: () => of(true)
    } as any;

    mockDialog.open.and.returnValue(mockDialogRef);
    mockWateringsService.deleteWatering.and.returnValue(throwError(() => new Error('Delete failed')));

    component.deleteWatering(mockWaterings[0]);

    expect(console.error).toHaveBeenCalledWith('Error deleting tree:', jasmine.any(Error));
  });
});
