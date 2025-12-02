import TokenBucket from "./customImplementation.js";

const buckets = new Map();

function tokenBucketMiddleware({
  capacity = 10,
  refillRate = 2,
  keyGenerator = (req) => req.ip,
}) {
  return function (req, res, next) {
    const key = keyGenerator(req);

    if (!buckets.has(key)) {
      buckets.set(key, new TokenBucket({ capacity, refillRate }));
    }

    const bucket = buckets.get(key);

    // Try consuming 1 token for each request
    const allowed = bucket.tryConsume(1);

    const state = bucket.getState();
    // Provide rate limit headers
    res.setHeader("X-RateLimit-Limit", state.capacity);
    res.setHeader("X-RateLimit-Remaining", Math.floor(state.tokens));

    // Approximate time to full reset

    const tokensToFull = state.capacity - state.tokens;
    const resetSeconds = tokensToFull / state.refillRate;

    res.setHeader("X-RateLimit-Reset", Math.ceil(resetSeconds));

    if (allowed) {
      return next();
    }

    return res.status(429).json({
      success: false,
      message: "Too many request - rate limit exceeded",
    });
  };
}

export default tokenBucketMiddleware;
