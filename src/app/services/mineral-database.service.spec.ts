import { TestBed } from '@angular/core/testing';

import { MineralDatabaseService } from './mineral-database.service';

describe('MineralDatabaseService', () => {
  let service: MineralDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MineralDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
