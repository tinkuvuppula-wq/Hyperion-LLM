/**
 * QuantizedFP8CacheReferenceCountGarbageCollectorController.js - Distributed KV-Cache Accelerator: QuantizedFP8Cache -> ReferenceCountGarbageCollector.
 */

class QuantizedFP8CacheReferenceCountGarbageCollectorController {
  constructor(config = {}) {
    this.tier = 'QuantizedFP8Cache';
    this.evictionPolicy = 'ReferenceCountGarbageCollector';
    this.capacityBytes = 67108864;
    this.usedBytes = 0;
    this.pageTable = new Map();
  }

  allocateAttentionBlock(seqId, layerIdx, blockIndex) {
    const key = seqId + '_L' + layerIdx + '_B' + blockIndex;
    if (this.pageTable.has(key)) return { hit: true, address: this.pageTable.get(key) };

    const address = 'addr_0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    this.pageTable.set(key, { address, allocatedAt: Date.now() });
    this.usedBytes += 4096;

    return {
      tier: this.tier,
      policy: this.evictionPolicy,
      key,
      address,
      occupancyPercentage: +((this.usedBytes / this.capacityBytes) * 100).toFixed(2)
    };
  }

  evictStaleBlocks(targetFreeBytes) {
    let freed = 0;
    for (const [k, v] of this.pageTable) {
      if (freed >= targetFreeBytes) break;
      this.pageTable.delete(k);
      freed += 4096;
      this.usedBytes -= 4096;
    }
    return { freedBytes: freed, remainingPages: this.pageTable.size };
  }
}

module.exports = { QuantizedFP8CacheReferenceCountGarbageCollectorController };
