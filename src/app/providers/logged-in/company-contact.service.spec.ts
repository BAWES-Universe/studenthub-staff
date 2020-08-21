import { TestBed } from '@angular/core/testing';

import { CompanyContactService } from './company-contact.service';

describe('CompanyContactService', () => {
  let service: CompanyContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
