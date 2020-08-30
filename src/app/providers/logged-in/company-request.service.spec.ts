import { TestBed } from '@angular/core/testing';

import { CompanyRequestService } from './company-request.service';

describe('CompanyRequestService', () => {
  let service: CompanyRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
