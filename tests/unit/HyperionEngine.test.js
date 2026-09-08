const { HyperionEngine } = require('../../src/core/HyperionEngine');
describe('Hyperion Speculative Decoding Engine', () => {
  test('generates tokens with speculative draft verification speedup', async () => {
    const engine = new HyperionEngine({ speculativeGamma: 4 });
    const res = await engine.generateSpeculativeTokens('Explain quantum superdense coding', 32);
    expect(res.tokens.length).toBe(32);
    expect(res.acceptanceRate).toBeGreaterThan(0.5);
  });
});