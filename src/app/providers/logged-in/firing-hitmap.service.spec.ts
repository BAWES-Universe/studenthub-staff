import { TestBed } from '@angular/core/testing';

import { FiringHitmapService } from './firing-hitmap.service';

describe('FiringHitmapService', () => {
  let service: FiringHitmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiringHitmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
