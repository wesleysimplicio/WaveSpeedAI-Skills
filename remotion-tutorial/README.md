# WaveSpeedAI Skill — Tutorial Animado (Remotion)

Vídeo explicativo de ~60 segundos (1920x1080, 30 fps) que mostra como instalar e usar a skill `wavespeed` em qualquer agent host (Claude, Codex, Hermes, OpenClaw, Cursor, Windsurf, generic).

> Renderizado 100% em código com [Remotion](https://www.remotion.dev/). Sem assets externos — backgrounds, partículas, code blocks e previews de mídia são gerados em runtime.

## Estrutura

```
src/
├── index.ts                       # registerRoot do Remotion
├── Root.tsx                       # composition WaveSpeedSkillTutorial
└── tutorial/
    ├── Tutorial.tsx               # sequencia as 7 cenas
    ├── timing.ts                  # tabela de duração + offsets
    ├── theme.ts                   # cores, fontes, gradientes
    ├── components/                # primitivas (Card, CodeBlock, MediaPreview…)
    └── scenes/                    # SceneIntro → SceneOutro
```

| # | Cena                | Duração  | Foco                                                  |
|---|---------------------|----------|-------------------------------------------------------|
| 1 | Intro               | 5.0 s    | Logo, título, hosts suportados, pulse animado         |
| 2 | O que é             | 9.0 s    | 3 cards: 700+ modelos · 290+ LLMs · CLI única         |
| 3 | Instalação          | 10.0 s   | Terminal animado + checklist do instalador            |
| 4 | Hosts suportados    | 8.0 s    | Grid de 7 hosts com path do `SKILL.md`                |
| 5 | CLI em ação         | 12.0 s   | Code block com `wavespeed-cli run` + grid de comandos |
| 6 | Exemplos            | 10.0 s   | Previews animados de imagem · vídeo · LLM             |
| 7 | Outro / CTA         | 6.0 s    | One-liner de instalação + repo + badges               |

Total: **60 s** = 1800 frames a 30 fps.

## Rodar

```bash
cd remotion-tutorial
npm install
npm run dev          # abre o Remotion Studio para preview interativo
npm run still        # gera out/preview.png (frame 90)
npm run build        # renderiza out/wavespeed-skill-tutorial.mp4
npm run build:webm   # renderiza .webm (vp9)
```

A primeira renderização baixa o Chromium headless (~150 MB) — depois fica em cache.

## Customizar

- **Cores e fontes**: `src/tutorial/theme.ts`.
- **Duração das cenas**: `src/tutorial/timing.ts` (tabela `SCENES`).
- **Conteúdo de uma cena**: `src/tutorial/scenes/<Scene>.tsx` — texto, comandos e props ficam inline para edição rápida.
- **Trocar formato vertical (Reels/Shorts)**: edite `src/Root.tsx` para `width: 1080, height: 1920` e ajuste padding nas cenas.

## Saída

- MP4 H.264 1920x1080 30 fps em `out/wavespeed-skill-tutorial.mp4`.
- O diretório `out/` está no `.gitignore` — não commita binário.
