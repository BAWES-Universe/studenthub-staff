import { TestBed } from '@angular/core/testing';

import { CronLogService } from './cron-log.service';

describe('CronLogService', () => {
  let service: CronLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CronLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
