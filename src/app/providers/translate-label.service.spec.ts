import { TestBed } from '@angular/core/testing';

import { TranslateLabelService } from './translate-label.service';

describe('TranslateLabelService', () => {
  let service: TranslateLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
