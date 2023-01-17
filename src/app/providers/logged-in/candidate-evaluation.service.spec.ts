import { TestBed } from '@angular/core/testing';

import { CandidateEvaluationService } from './candidate-evaluation.service';

describe('CandidateEvaluationService', () => {
  let service: CandidateEvaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateEvaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
