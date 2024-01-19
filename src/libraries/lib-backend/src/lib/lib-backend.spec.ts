import { libBackend } from './lib-backend';

describe('libBackend', () => {
  it('should work', () => {
    expect(libBackend()).toEqual('lib-backend');
  });
});
