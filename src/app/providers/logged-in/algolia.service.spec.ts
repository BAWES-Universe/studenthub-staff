import { TestBed } from '@angular/core/testing';

import { AlgoliaService } from './algolia.service';

describe('AlgoliaService', () => {
  let service: AlgoliaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgoliaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
