import { TestBed } from '@angular/core/testing';

import { SuggessionService } from './suggession.service';

describe('SuggessionService', () => {
  let service: SuggessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
