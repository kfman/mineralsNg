import { TestBed } from '@angular/core/testing';

import { LeaveEditPageGuard } from './leave-edit-page.guard';

describe('LeaveEditPageGuard', () => {
  let guard: LeaveEditPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LeaveEditPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
