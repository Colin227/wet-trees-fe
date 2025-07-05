import { TestBed } from '@angular/core/testing';
import { SitesService } from './sites.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateSiteDto, Site } from '@models';
import { environment } from 'environments/environment';

describe('SitesService', () => {
  let service: SitesService;
  let httpMock: HttpTestingController;

  const mockSite: Site = {
    id: 1,
    name: 'Test Site',
    location: 'Test Location',
    zones: []
  };

  const createSiteDto: CreateSiteDto = {
    name: 'Test Site',
    location: 'Test Location'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SitesService]
    });

    service = TestBed.inject(SitesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all sites', () => {
    service.getAllSites().subscribe(sites => {
      expect(sites).toEqual([mockSite]);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/sites`);
    expect(req.request.method).toBe('GET');
    req.flush([mockSite]);
  });

  it('should create a site', () => {
    service.createSite(createSiteDto).subscribe(site => {
      expect(site).toEqual(mockSite);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/sites`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createSiteDto);
    req.flush(mockSite);
  });

  it('should update a site', () => {
    const updatedSite: Site = { ...mockSite, name: 'Updated Site' };

    service.updateSite(mockSite.id, createSiteDto).subscribe(site => {
      expect(site).toEqual(updatedSite);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/sites/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(createSiteDto);
    req.flush(updatedSite);
  });

  it('should delete a site', () => {
    service.deleteSite(mockSite.id).subscribe(response => {
      expect(response).toBeNull(); 
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/sites/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
