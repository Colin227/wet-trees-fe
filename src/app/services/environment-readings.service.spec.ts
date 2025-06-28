import { TestBed } from '@angular/core/testing';

import { EnvironmentReadingsService } from './environment-readings.service';

describe('EnvironmentReadingsService', () => {
  let service: EnvironmentReadingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentReadingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
