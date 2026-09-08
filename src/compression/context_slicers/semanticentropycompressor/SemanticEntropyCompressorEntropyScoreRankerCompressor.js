/**
 * SemanticEntropyCompressorEntropyScoreRankerCompressor.js - Prompt Context Compression: SemanticEntropyCompressor -> EntropyScoreRanker.
 */

class SemanticEntropyCompressorEntropyScoreRankerCompressor {
  constructor(compConfig = {}) {
    this.domain = 'SemanticEntropyCompressor';
    this.filterType = 'EntropyScoreRanker';
    this.compressionRatioTarget = 0.61;
    this.tokensPreserved = 0;
    this.tokensPruned = 0;
  }

  compressContextWindow(promptText, tokenLimit = 2048) {
    const rawTokens = promptText.split(/\s+/);
    const targetCount = Math.min(tokenLimit, Math.floor(rawTokens.length * this.compressionRatioTarget)) || 1;
    const compressed = rawTokens.slice(0, targetCount);

    this.tokensPreserved += compressed.length;
    this.tokensPruned += (rawTokens.length - compressed.length);

    return {
      domain: this.domain,
      filter: this.filterType,
      originalTokens: rawTokens.length,
      compressedTokens: compressed.length,
      ratioAchieved: +(compressed.length / (rawTokens.length || 1)).toFixed(3),
      compressedText: compressed.join(' ')
    };
  }
}

module.exports = { SemanticEntropyCompressorEntropyScoreRankerCompressor };
