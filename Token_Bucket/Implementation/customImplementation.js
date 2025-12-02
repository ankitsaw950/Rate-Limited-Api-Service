class TokenBucket {
  /**
   * capacity : max tokens (Number)
   * refillRate : tokens per second (Number)
   **/

  constructor({ capacity = 10, refillRate = 2 }) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const elapsedMs = now - this.lastRefill;

    if (elapsedMs <= 0) {
      return;
    }

    const refillTokens = (elapsedMs / 1000) * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + refillTokens);
    this.lastRefill = now;
  }

  /**
   * tryConsume(n=1): returns true if tokens consumed, false otherwise
   */
  tryConsume(n = 1) {
    this.refill();
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }

  getState() {
    this.refill();
    return {
      tokens: this.tokens,
      capacity: this.capacity,
      refillRate: this.refillRate,
    };
  }
}

export default TokenBucket
