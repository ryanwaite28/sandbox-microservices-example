import { YouAuthorized } from './auth.guard';

describe('YouAuthorized', () => {
  it('should be defined', () => {
    expect(new YouAuthorized()).toBeDefined();
  });
});
