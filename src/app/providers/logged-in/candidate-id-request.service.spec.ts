import { TestBed } from '@angular/core/testing';

import { CandidateIdRequestService } from './candidate-id-request.service';

describe('CandidateIdRequestService', () => {
  let service: CandidateIdRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateIdRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
