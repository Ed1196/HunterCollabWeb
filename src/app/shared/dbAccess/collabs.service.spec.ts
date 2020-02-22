import { TestBed } from '@angular/core/testing';

import { CollabsService } from './collabs.service';

describe('CollabsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollabsService = TestBed.get(CollabsService);
    expect(service).toBeTruthy();
  });
});
