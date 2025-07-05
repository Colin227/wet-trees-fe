import { TestBed } from '@angular/core/testing';
import { TreesService } from './trees.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tree, CreateTreeDto } from '@models';
import { environment } from 'environments/environment';

describe('TreesService', () => {
  let service: TreesService;
  let httpMock: HttpTestingController;

  const mockTree: Tree = {
    id: 1,
    species: 'Maple',
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
  };

  const createTreeDto: CreateTreeDto = {
    species: mockTree.species,
    plantedAt: mockTree.plantedAt,
    status: mockTree.status as any,
    zoneId: mockTree.zone.id
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TreesService]
    });

    service = TestBed.inject(TreesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all trees', () => {
    service.getAllTrees().subscribe(trees => {
      expect(trees).toEqual([mockTree]);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/trees`);
    expect(req.request.method).toBe('GET');
    req.flush([mockTree]);
  });

  it('should create a tree', () => {
    service.createTree(createTreeDto).subscribe(tree => {
      expect(tree).toEqual(mockTree);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/trees`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createTreeDto);
    req.flush(mockTree);
  });

  it('should update a tree', () => {
    const updatedDto: CreateTreeDto = { ...createTreeDto, status: 'needs_attention' };

    service.updateTree(mockTree.id, updatedDto).subscribe(tree => {
      expect(tree.status).toBe('damaged');
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/trees/${mockTree.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedDto);
    req.flush({ ...mockTree, status: 'damaged' });
  });

  it('should delete a tree', () => {
    service.deleteTree(mockTree.id).subscribe(result => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/trees/${mockTree.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
