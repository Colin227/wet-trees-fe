import { TestBed } from '@angular/core/testing';

import { WateringsService } from './waterings.service';

describe('WateringsService', () => {
  let service: WateringsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WateringsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
