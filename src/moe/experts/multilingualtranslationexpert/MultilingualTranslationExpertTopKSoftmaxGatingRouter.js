/**
 * MultilingualTranslationExpertTopKSoftmaxGatingRouter.js - Mixture-of-Experts Router: MultilingualTranslationExpert -> TopKSoftmaxGating.
 */

class MultilingualTranslationExpertTopKSoftmaxGatingRouter {
  constructor(config = {}) {
    this.domain = 'MultilingualTranslationExpert';
    this.routerStrategy = 'TopKSoftmaxGating';
    this.numExperts = 24;
    this.topK = 2;
    this.capacityFactor = 1.20;
    this.loadDistribution = new Array(this.numExperts).fill(0);
  }

  routeTokens(tokenEmbeddings, expertRegistry = []) {
    const routedBatches = [];
    for (let i = 0; i < tokenEmbeddings.length; i++) {
      const topExperts = this.selectTopKExperts(tokenEmbeddings[i], this.topK);
      routedBatches.push({
        tokenId: i,
        assignedExperts: topExperts,
        domain: this.domain,
        router: this.routerStrategy
      });
      topExperts.forEach(exp => this.loadDistribution[exp.id]++);
    }

    return {
      domain: this.domain,
      router: this.routerStrategy,
      totalTokensRouted: tokenEmbeddings.length,
      routedBatches,
      loadBalanceScore: +this.computeLoadBalanceScore().toFixed(4)
    };
  }

  selectTopKExperts(embedding, k) {
    return Array.from({ length: k }, (_, idx) => ({
      id: (idx + 2) % this.numExperts,
      weight: +(0.85 - idx * 0.25).toFixed(3)
    }));
  }

  computeLoadBalanceScore() {
    const avg = this.loadDistribution.reduce((a, b) => a + b, 0) / this.numExperts || 1;
    const variance = this.loadDistribution.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.numExperts;
    return 1.0 / (1.0 + Math.sqrt(variance));
  }
}

module.exports = { MultilingualTranslationExpertTopKSoftmaxGatingRouter };
