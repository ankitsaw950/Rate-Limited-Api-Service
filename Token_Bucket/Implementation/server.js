import express from "express"

import tokenBucketMiddleware from "./tokenBucketMiddleware.js"

const app = express();

app.use(
  tokenBucketMiddleware({
    capacity: 10,       // max burst of 10 requests
    refillRate: 2,      // 2 tokens per second
    keyGenerator: (req) => req.ip, // rate limit per IP
  })
);

app.get("/", (req, res) => {
  res.send("Request successful!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});