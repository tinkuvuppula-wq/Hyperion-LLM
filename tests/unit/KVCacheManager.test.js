const { KVCacheClusterManager } = require('../../src/core/KVCacheClusterManager');
describe('Distributed Paged KV-Cache Manager', () => {
  test('allocates and releases paged sequences without memory fragmentation', () => {
    const kv = new KVCacheClusterManager(16, 128);
    const alloc = kv.allocateSequenceCache('seq_001', 32);
    expect(alloc.blocksAllocated).toBe(2);
    const released = kv.releaseSequenceCache('seq_001');
    expect(released).toBe(true);
  });
});