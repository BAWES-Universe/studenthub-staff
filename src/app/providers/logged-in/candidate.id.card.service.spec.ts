import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthHttpService } from './authhttp.service';
import { CandidateIdCardService } from './candidate.id.card.service';

describe('CandidateIdCardService', () => {
  let service: CandidateIdCardService;
  let authHttp: jasmine.SpyObj<AuthHttpService>;

  beforeEach(() => {
    authHttp = jasmine.createSpyObj('AuthHttpService', ['post', 'get', 'getRaw', 'generateCards']);

    TestBed.configureTestingModule({
      providers: [{ provide: AuthHttpService, useValue: authHttp }]
    });
    service = TestBed.inject(CandidateIdCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generate() should POST candidates and emit the JSON response', (done) => {
    const apiResponse = { operation: 'success', cir_uuid: 'abc-123' };
    authHttp.post.and.returnValue(of(apiResponse));

    service.generate([1, 2]).subscribe(response => {
      expect(authHttp.post).toHaveBeenCalledWith('/candidate-id-cards/generate', { candidates: [1, 2] });
      expect(authHttp.generateCards).not.toHaveBeenCalled();
      expect(response).toEqual(apiResponse);
      expect(response.operation).toBe('success');
      done();
    });
  });
});
