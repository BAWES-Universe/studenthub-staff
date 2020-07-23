import { TestBed } from '@angular/core/testing';

import { AuthhttpService } from './authhttp.service';

describe('AuthhttpService', () => {
  let service: AuthhttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthhttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
