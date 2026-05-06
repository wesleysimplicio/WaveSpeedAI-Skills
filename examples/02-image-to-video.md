# Image → video

Bring a still image to life. Two-step: upload, then run a video model with the hosted URL as the `image` field.

## Seedance v2 (cinematic camera moves)

```bash
URL=$(wavespeed-cli upload ./hero.png)
wavespeed-cli run wavespeed-ai/seedance-v2 \
  "$(jq -nc --arg u "$URL" '{
      image: $u,
      prompt: "slow dolly in, soft natural light, subject stays centered",
      duration: 5,
      aspect_ratio: "16:9"
   }')"
```

## Kling v2.1 (versatile, good with people)

```bash
URL=$(wavespeed-cli upload ./portrait.jpg)
wavespeed-cli run wavespeed-ai/kling-v2.1 \
  "$(jq -nc --arg u "$URL" '{image:$u, prompt:"the subject smiles and waves"}')" \
  --timeout 1800
```

## Luma Dream Machine

```bash
URL=$(wavespeed-cli upload ./still.jpg)
wavespeed-cli run wavespeed-ai/luma-dream-machine \
  "$(jq -nc --arg u "$URL" '{image:$u, prompt:"lazy zoom out, light wind in foliage"}')"
```

## Async pattern (recommended for video)

```bash
ID=$(wavespeed-cli submit wavespeed-ai/seedance-v2 \
       "$(jq -nc --arg u "$URL" '{image:$u, prompt:"..."}')" \
     --webhook-url https://your.app/wavespeed/cb \
     | jq -r '.data.id')
echo "task: $ID"

# Later, or from your webhook handler:
wavespeed-cli result "$ID"
```

## Tips

- Aspect ratio matters: keep the source image close to the target video AR.
- Faces: Kling and Higgsfield's identity-preserving models retain likeness better than Seedance.
- Use `"duration": 5` (seconds) by default; longer durations cost more and the result quality drops past 8s.
- If the camera move is wrong, try rephrasing in the present continuous: "the camera is dollying in".
