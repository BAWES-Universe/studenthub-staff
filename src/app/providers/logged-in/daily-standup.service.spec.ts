import { TestBed } from '@angular/core/testing';

import { DailyStandupService } from './daily-standup.service';

describe('DailyStandupService', () => {
  let service: DailyStandupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyStandupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
