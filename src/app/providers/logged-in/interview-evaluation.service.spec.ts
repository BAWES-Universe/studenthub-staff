import { TestBed } from '@angular/core/testing';

import { InterviewEvaluationService } from './interview-evaluation.service';

describe('InterviewEvaluationService', () => {
  let service: InterviewEvaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterviewEvaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
