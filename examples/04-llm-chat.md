# LLM chat (OpenAI-compatible)

WaveSpeed exposes 290+ LLMs (Anthropic, OpenAI, Google, DeepSeek, Meta, Mistral, Qwen, …) behind one OpenAI-compatible endpoint. Drop-in for any client that supports `base_url`.

Base URL: `https://llm.wavespeed.ai/v1`

## CLI

```bash
wavespeed-cli llm anthropic/claude-opus-4.6 "Summarize WaveSpeed in 10 words."
wavespeed-cli llm openai/gpt-5.2-pro "Write a haiku about caching." --system "You are terse."
wavespeed-cli llm google/gemini-3-flash-preview '{"city":"Lisbon"}' --json-mode --raw
wavespeed-cli llm deepseek/deepseek-v4 "Explain MoE in 3 lines." --stream
wavespeed-cli llm meta-llama/llama-4-70b "..." --temperature 0.2 --max-tokens 200
```

## Python (OpenAI client)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://llm.wavespeed.ai/v1",
    api_key=os.environ["WAVESPEED_API_KEY"],
)

resp = client.chat.completions.create(
    model="anthropic/claude-opus-4.6",
    messages=[
        {"role": "system", "content": "You are a senior PHP reviewer."},
        {"role": "user", "content": "Critique this snippet: ..."},
    ],
)
print(resp.choices[0].message.content)
```

## Streaming

```python
stream = client.chat.completions.create(
    model="openai/gpt-5.2-pro",
    messages=[{"role": "user", "content": "Tell me a story."}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content or ""
    print(delta, end="", flush=True)
```

## JSON mode

```python
resp = client.chat.completions.create(
    model="google/gemini-3-flash-preview",
    response_format={"type": "json_object"},
    messages=[
        {"role": "system", "content": "Reply with JSON only."},
        {"role": "user", "content": "Cities of Portugal as a list under key 'cities'."},
    ],
)
import json; print(json.loads(resp.choices[0].message.content))
```

## When this is the right choice

- You already have OpenAI-flavored code and want cheaper Anthropic / Gemini access.
- You want a single billing line for media + LLM.
- You're routing across providers and want one HMAC-verified webhook surface.

## When it isn't

- You need provider-specific features (e.g., Anthropic computer-use tools, OpenAI Assistants v2). Hit the vendor SDK directly for those.
