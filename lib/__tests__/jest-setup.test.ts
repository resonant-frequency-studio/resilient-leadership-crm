/**
 * Simple smoke test to verify Jest is working correctly
 */
describe('Jest Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should have access to testing utilities', () => {
    const testValue = 'test';
    expect(testValue).toBe('test');
    expect(testValue).toHaveLength(4);
  });

  it('should support async operations', async () => {
    const promise = Promise.resolve('resolved');
    await expect(promise).resolves.toBe('resolved');
  });
});

