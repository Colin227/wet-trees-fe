import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { SitesComponent } from './sites.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SitesService } from 'app/services/sites.service';
import { ZonesService } from 'app/services/zones.service';
import { Site, Zone } from '@models';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

describe('SitesComponent', () => {
  let component: SitesComponent;
  let fixture: ComponentFixture<SitesComponent>;
  let mockSitesService: jasmine.SpyObj<SitesService>;
  let mockZonesService: jasmine.SpyObj<ZonesService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockSites: Site[] = [
    { id: 1, name: 'Site A', location: 'Location A', zones: [] },
    { id: 2, name: 'Site B', location: 'Location B', zones: [] }
  ];

  beforeEach(async () => {
    mockSitesService = jasmine.createSpyObj('SitesService', ['getAllSites', 'deleteSite']);
    mockZonesService = jasmine.createSpyObj('ZonesService', ['deleteZone']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [MatTableModule, MatSortModule, SitesComponent],
      providers: [
        { provide: SitesService, useValue: mockSitesService },
        { provide: ZonesService, useValue: mockZonesService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SitesComponent);
    component = fixture.componentInstance;
    component.table = {
      renderRows: jasmine.createSpy('renderRows')
    } as any;
    
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load sites on init', fakeAsync(() => {
    mockSitesService.getAllSites.and.returnValue(of(mockSites));
    fixture.detectChanges(); // triggers ngOnInit
    tick();
    fixture.detectChanges();

    expect(mockSitesService.getAllSites).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    flush();
  }));

  it('should open dialog when creating site', () => {
    const afterClosed$ = of({ id: 3, name: 'Site C' });
    mockDialog.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);

    mockSitesService.getAllSites.and.returnValue(of(mockSites));
    component.createSite();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should open confirmation dialog and delete site', () => {
    const mockSite = { id: 1, name: 'Test Site', location: '', zones: [] };
    mockDialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    mockSitesService.deleteSite.and.returnValue(of(void 0));
    mockSitesService.getAllSites.and.returnValue(of([]));

    component.deleteSite(mockSite);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockSitesService.deleteSite).toHaveBeenCalledWith(mockSite.id);
  });

  it('should open confirmation dialog and delete zone', () => {
    const mockZone: Zone = { id: 1, name: 'Zone A', site: mockSites[0], trees: [], wateringEvents: [], environmentReadings: [], devices: [] };
    mockDialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
    mockZonesService.deleteZone.and.returnValue(of(void 0));
    mockSitesService.getAllSites.and.returnValue(of([]));

    component.deleteZone(mockZone);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockZonesService.deleteZone).toHaveBeenCalledWith(mockZone.id);
  });
});
