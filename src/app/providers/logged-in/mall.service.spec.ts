import { TestBed } from '@angular/core/testing';

import { MallService } from './mall.service';

describe('MallService', () => {
  let service: MallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
