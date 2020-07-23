import { TestBed } from '@angular/core/testing';

import { CandidateIdCardService } from './candidate.id.card.service';

describe('CandidateIdCardService', () => {
  let service: CandidateIdCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateIdCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
