import { TestBed } from '@angular/core/testing';

import { YeasterService } from './yeaster.service';

describe('YeasterService', () => {
  let service: YeasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YeasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
