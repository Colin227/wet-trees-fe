import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TreesComponent } from './trees.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TreesService } from 'app/services/trees.service';
import { Tree } from '@models';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mocks
const mockTrees: Tree[] = [
  {
    id: 1,
    species: 'Oak',
    plantedAt: new Date().toISOString(),
    status: 'healthy',
    zone: {
      id: 1,
      name: 'Zone A',
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
    healthLogs: []
  }
];

const treesServiceMock = {
  getAllTrees: jasmine.createSpy().and.returnValue(of(mockTrees)),
  deleteTree: jasmine.createSpy().and.returnValue(of(undefined))
};

const matDialogMock = {
  open: jasmine.createSpy().and.returnValue({
    afterClosed: () => of(true)
  })
};

describe('TreesComponent', () => {
  let component: TreesComponent;
  let fixture: ComponentFixture<TreesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        TreesComponent
      ],
      providers: [
        DatePipe,
        { provide: TreesService, useValue: treesServiceMock },
        { provide: MatDialog, useValue: matDialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    treesServiceMock.getAllTrees.calls.reset();
    treesServiceMock.deleteTree.calls.reset();
    matDialogMock.open.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load trees on init', () => {
    expect(treesServiceMock.getAllTrees).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockTrees);
  });

  it('should call createTree and reload trees', fakeAsync(() => {
    component.createTree();
    tick();
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(treesServiceMock.getAllTrees).toHaveBeenCalledTimes(2); // initial load + after dialog close
  }));

  it('should call editTree and reload trees', fakeAsync(() => {
    component.editTree(mockTrees[0]);
    tick();
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(treesServiceMock.getAllTrees).toHaveBeenCalledTimes(2);
  }));

  it('should call deleteTree and reload trees', fakeAsync(() => {
    component.deleteTree(mockTrees[0]);
    tick();
    expect(treesServiceMock.deleteTree).toHaveBeenCalledWith(mockTrees[0].id);
    expect(treesServiceMock.getAllTrees).toHaveBeenCalledTimes(2);
  }));
});
