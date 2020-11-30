import { TestBed } from '@angular/core/testing';

import { FulltimerService } from './fulltimer.service';

describe('FulltimerService', () => {
  let service: FulltimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FulltimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
