# Tutorial scene evidence

Per-scene stills rendered from the Remotion composition `WaveSpeedSkillTutorial`
(see [`remotion-tutorial/`](../../../remotion-tutorial/)). Each PNG is captured
at a representative frame near the middle of its scene, after entrance
animations have settled.

These stills are the regression evidence for the animated tutorial: if a
future change to the composition silently breaks one of the scenes, a new
render here will surface the visual diff.

| # | Scene | File | Frame | Highlights |
|---|---|---|---:|---|
| 1 | Intro | [01-intro.png](01-intro.png) | 90 | Logo, title, host chips, animated waveform pulse |
| 2 | What is the skill | [02-what.png](02-what.png) | 240 | 3 feature cards: 700+ media · 290+ LLMs · CLI |
| 3 | Install | [03-install.png](03-install.png) | 520 | Animated terminal + installer step checklist |
| 4 | Supported hosts | [04-hosts.png](04-hosts.png) | 820 | Grid of 7 hosts with each `SKILL.md` path |
| 5 | CLI in action | [05-cli.png](05-cli.png) | 1180 | `wavespeed-cli run` typing demo + subcommand grid |
| 6 | Examples | [06-examples.png](06-examples.png) | 1460 | Image · video · LLM previews |
| 7 | Outro / CTA | [07-outro.png](07-outro.png) | 1720 | One-line install + repo + license + spec badges |

## Re-generate

```bash
cd remotion-tutorial
npm install
mkdir -p out/regression
npx remotion still WaveSpeedSkillTutorial out/regression/01-intro.png    --frame=90
npx remotion still WaveSpeedSkillTutorial out/regression/02-what.png     --frame=240
npx remotion still WaveSpeedSkillTutorial out/regression/03-install.png  --frame=520
npx remotion still WaveSpeedSkillTutorial out/regression/04-hosts.png    --frame=820
npx remotion still WaveSpeedSkillTutorial out/regression/05-cli.png      --frame=1180
npx remotion still WaveSpeedSkillTutorial out/regression/06-examples.png --frame=1460
npx remotion still WaveSpeedSkillTutorial out/regression/07-outro.png    --frame=1720
cp out/regression/*.png ../docs/media/scenes/
```
