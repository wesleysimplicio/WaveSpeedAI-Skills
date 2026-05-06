# Text → video with audio (Veo 3)

Veo 3 is one of the few text-to-video models that ships native audio. No second pass for SFX.

## CLI

```bash
wavespeed-cli run wavespeed-ai/veo-3 '{
  "prompt": "Thunderstorm at dusk over a small fishing village. Wind, rain, distant thunder.",
  "aspect_ratio": "16:9",
  "duration": 8,
  "audio": true
}' --timeout 1800
```

## Python (async submit + webhook)

```python
import wavespeed
from wavespeed import Client

client = Client(retry_interval=2.0)
job = client.submit("wavespeed-ai/veo-3", {
    "prompt": "macro, dewdrop falling on a leaf, slow motion, soft rainforest ambience",
    "audio": True,
}, webhook_url="https://your.app/wavespeed/cb")
print(job["id"])
```

## Variants

| uuid | trade-off |
|---|---|
| `wavespeed-ai/veo-3` | flagship; best fidelity |
| `wavespeed-ai/veo-3-fast` | half the cost, ~3× faster, slightly less detail |
| `wavespeed-ai/veo-3.1` | newer iteration; check `models --filter veo` |

## Tips

- Veo prefers short, vivid sentences over long paragraphs.
- Mention the soundscape explicitly ("rain on metal", "low cello drone") — the model will mix it.
- For dialog, add `"speech": "She says: 'we should go.'"` if the model variant supports it.
- 8 seconds is the sweet spot. 16-second jobs are 4× slower and rarely 2× better.
