# Text → image

Smallest possible round-trip: prompt in, hosted image URL out.

## CLI

```bash
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Octopus playing chess, studio lighting"}'
```

Pretty-print just the URL:

```bash
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"..."}' \
  | jq -r '.data.outputs[0]'
```

## Python

```python
import wavespeed

out = wavespeed.run(
    "wavespeed-ai/z-image/turbo",
    {"prompt": "Octopus playing chess, studio lighting"},
    timeout=120.0,
    poll_interval=0.5,
)
print(out["outputs"][0])
```

## Higher quality (FLUX dev)

```bash
wavespeed-cli run wavespeed-ai/flux-dev '{
  "prompt": "Forest cottage at golden hour, fireflies, cinematic",
  "size": "1024x1024",
  "output_format": "png",
  "num_inference_steps": 28,
  "guidance_scale": 3.5
}'
```

## Tips

- Z-Image turbo: <2 seconds. Use it for thumbnails, A/B prompt experiments.
- FLUX dev: 5–10 seconds, far better detail. Default for marketing assets.
- FLUX pro: best quality, slower, costs more.
- For fixed seeds, pass `"seed": 12345`.
- For multiple variants in one call, use `"num_outputs": 4` (where supported).
