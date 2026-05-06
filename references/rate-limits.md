# Rate limits & account tiers

Tier is determined by your top-up history. New accounts start at Bronze with a small trial credit. Limits are per-minute, applied at the API gateway.

| Tier | Top-up to reach | Images / min | Videos / min | Concurrent tasks | Notes |
|---|---|---|---|---|---|
| Bronze | default | 10 | 5 | 5 | trial credit (~$1); some advanced models locked |
| Silver | $100 | 500 | 60 | 50 | unlocks most models |
| Gold | $1,000 | 3,000 | 600 | 500 | priority routing |
| Ultra | $10,000 | 5,000 | 5,000 | 5,000 | dedicated support, custom limits available |

The LLM gateway has its own per-model quotas separate from the media tiers.

## Headers

When you're approaching a limit, look for these in the response:

- `X-RateLimit-Limit` — your current cap.
- `X-RateLimit-Remaining` — calls left in the current window.
- `X-RateLimit-Reset` — epoch seconds when the window rolls over.
- `Retry-After` — only on 429s; honor this if present.

## Strategies

- **Throttle at submit, not poll.** Polling is cheap. Submits are what bill and trigger 429s. Use `asyncio.Semaphore` matching your tier's per-minute cap divided by 60.
- **Webhook for batches >50 jobs.** Don't keep 500 sockets open polling. Submit + persist `id`s + handle completions in your webhook.
- **Backoff with jitter.** On 429, wait `Retry-After + random.uniform(0, 1)` seconds. Without jitter, parallel workers will resume in lock-step and re-trigger the limit.
- **Pin retries low for non-idempotent operations.** Submit is idempotent (each call is a new prediction); polling is idempotent; uploads are idempotent until you delete. LLM streaming is _not_ — a partial stream can't be cleanly retried.

## Custom limits

If you regularly bump into Ultra ceilings, contact `support@wavespeed.ai` with your usage profile. Enterprise limits go well past the published table.
