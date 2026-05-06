# LoRA: text → image with a custom style

LoRAs let you steer FLUX-class models toward a specific subject, art style, or product. WaveSpeed accepts LoRAs from the Hugging Face Hub via path + scale.

## CLI

```bash
wavespeed-cli run wavespeed-ai/flux-dev-lora '{
  "prompt": "pixel art of a cat astronaut",
  "loras": [
    {"path": "nerijs/pixel-art-xl", "scale": 0.85}
  ],
  "output_format": "png"
}'
```

## Multi-LoRA (stack styles)

```bash
wavespeed-cli run wavespeed-ai/flux-dev-lora '{
  "prompt": "studio portrait of a woman, ultra-detailed, soft rim light",
  "loras": [
    {"path": "alvdansen/frosting_lane_flux",  "scale": 0.7},
    {"path": "XLabs-AI/flux-RealismLora",     "scale": 0.4}
  ]
}'
```

## Python

```python
import wavespeed

out = wavespeed.run(
    "wavespeed-ai/flux-dev-lora",
    {
        "prompt": "watercolor of a quiet harbour at dawn",
        "loras": [{"path": "ostris/watercolor-style", "scale": 0.9}],
        "size": "1024x1024",
    },
)
```

## Training your own LoRA

WaveSpeed offers LoRA training as a separate model family. See `wavespeed-cli models --filter lora-trainer` for the live list. Typical inputs:

```json
{
  "training_data": "https://...zip-of-images.zip",
  "instance_prompt": "photo of <my-subject>",
  "max_train_steps": 1500,
  "rank": 16
}
```

Output: a hosted LoRA path you can pass straight back into `flux-dev-lora`.

## Tips

- Scale 0.7–0.9 is the usual range. >1.0 starts overfitting (cooked-looking subjects).
- Stacking 3+ LoRAs is fragile — drop scale to 0.3–0.5 each.
- Always include the trigger word from the LoRA's model card in your prompt.
