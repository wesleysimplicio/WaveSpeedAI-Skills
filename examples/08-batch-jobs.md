# Batch jobs

For "render 200 hero variants" workloads, fire submits in parallel and collect results from a queue. Don't loop with `run` — that polls each job to terminal before starting the next.

## Pattern

```python
import asyncio, json, os, aiohttp

API = "https://api.wavespeed.ai/api/v3"
KEY = os.environ["WAVESPEED_API_KEY"]
HDR = {"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

PROMPTS = [f"product photo, variant {i}" for i in range(200)]

async def submit(session, prompt):
    async with session.post(
        f"{API}/wavespeed-ai/z-image/turbo",
        headers=HDR, json={"prompt": prompt},
    ) as r:
        body = await r.json()
        return body["data"]["id"]

async def poll(session, task_id):
    while True:
        async with session.get(
            f"{API}/predictions/{task_id}/result", headers=HDR,
        ) as r:
            body = (await r.json())["data"]
        if body["status"] in ("completed", "failed"):
            return body
        await asyncio.sleep(0.5)

async def main():
    sem_submit = asyncio.Semaphore(20)   # rate limit
    sem_poll   = asyncio.Semaphore(40)
    async with aiohttp.ClientSession() as s:
        async def one(p):
            async with sem_submit:
                tid = await submit(s, p)
            async with sem_poll:
                return await poll(s, tid)
        return await asyncio.gather(*(one(p) for p in PROMPTS))

results = asyncio.run(main())
print(json.dumps(results[:3], indent=2))
```

## Tips

- Match concurrency to your tier (`Bronze=10/min`, `Silver=500/min`, etc. — check `wavespeed-cli balance` and the docs for your tier).
- Catch `429` and back off. Don't retry `400`.
- Persist `task_id`s to disk before polling — if the script dies, you can resume.
- For really large batches (thousands), use webhooks instead of polling. Submit in a tight loop, persist `id` → row, then handle completions in the webhook.
- Bash one-liner for tiny batches:

  ```bash
  for p in "cat" "dog" "fish"; do
    wavespeed-cli run wavespeed-ai/z-image/turbo \
      "$(jq -nc --arg p "$p" '{prompt:$p}')" \
      | jq -r '.data.outputs[0]'
  done
  ```
