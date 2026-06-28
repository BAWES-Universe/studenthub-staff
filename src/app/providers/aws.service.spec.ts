import { TestBed } from '@angular/core/testing';

import { AwsService } from './aws.service';

describe('AwsService', () => {
  let service: AwsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should prefer candidate_personal_photo_url over legacy Cloudinary fallback', () => {
    const url = service.getCandidatePersonalPhotoUrl({
      candidate_personal_photo: 'legacy.jpg',
      candidate_personal_photo_url: 'https://example.com/candidate-profile-photos/new.jpg',
    });
    expect(url).toBe('https://example.com/candidate-profile-photos/new.jpg');
  });

  it('should fall back to Cloudinary URL when resolved url is absent', () => {
    const url = service.getCandidatePersonalPhotoUrl({
      candidate_personal_photo: 'legacy.jpg',
    });
    expect(url).toContain('candidate-photo/legacy.jpg');
  });
});
