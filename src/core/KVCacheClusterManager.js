/**
 * KVCacheClusterManager.js - Paged Distributed KV-Cache Memory Management
 */
class KVCacheClusterManager {
  constructor(blockSize = 16, maxBlocks = 8192) {
    this.blockSize = blockSize;
    this.maxBlocks = maxBlocks;
    this.allocatedBlocks = new Map();
    this.freeBlocks = Array.from({ length: maxBlocks }, (_, i) => i);
  }

  allocateSequenceCache(seqId, initialTokens = 64) {
    const blocksNeeded = Math.ceil(initialTokens / this.blockSize);
    if (this.freeBlocks.length < blocksNeeded) {
      throw new Error('KV-Cache out of memory. Capacity exhausted.');
    }

    const assignedBlocks = this.freeBlocks.splice(0, blocksNeeded);
    this.allocatedBlocks.set(seqId, {
      seqId,
      blocks: assignedBlocks,
      tokenCount: initialTokens,
      allocatedAt: Date.now()
    });

    return { seqId, blocksAllocated: assignedBlocks.length, memoryMb: +(blocksNeeded * 0.5).toFixed(2) };
  }

  appendTokens(seqId, tokenCount) {
    const seq = this.allocatedBlocks.get(seqId);
    if (!seq) throw new Error('Sequence ' + seqId + ' not found in KV cache');

    seq.tokenCount += tokenCount;
    const totalBlocksNeeded = Math.ceil(seq.tokenCount / this.blockSize);
    if (totalBlocksNeeded > seq.blocks.length) {
      const extra = totalBlocksNeeded - seq.blocks.length;
      if (this.freeBlocks.length < extra) throw new Error('Cannot expand KV cache for ' + seqId);
      const newBlocks = this.freeBlocks.splice(0, extra);
      seq.blocks.push(...newBlocks);
    }
    return { seqId, totalTokens: seq.tokenCount, totalBlocks: seq.blocks.length };
  }

  releaseSequenceCache(seqId) {
    const seq = this.allocatedBlocks.get(seqId);
    if (seq) {
      this.freeBlocks.push(...seq.blocks);
      this.allocatedBlocks.delete(seqId);
      return true;
    }
    return false;
  }
}

module.exports = { KVCacheClusterManager };
