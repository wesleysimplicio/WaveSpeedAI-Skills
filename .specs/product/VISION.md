# VISION — WaveSpeedAI-Skills

Documento de uma página. Mantém o time alinhado sobre o porquê. Atualizar quando a tese mudar; nunca apagar a versão anterior sem registrar em ADR.

---

## Problema

Cada agent host (Claude Code, Codex CLI, Hermes, OpenClaw, Cursor, Windsurf, ...) lê arquivos `SKILL.md` em diretórios diferentes, com frontmatter ligeiramente diferente. Não existe um bundle de skill canônico, testado e community-maintained que cubra todos eles para a plataforma de inferência **WaveSpeedAI** (700+ modelos de mídia + 290+ LLMs OpenAI-compatíveis).

Sem isso, cada usuário escreve seu próprio `SKILL.md` ad-hoc por host, replica boilerplate de submit/poll/webhook, e perde tempo lidando com diferenças de path e formato em vez de gerar mídia/LLM.

---

## Quem usa

Resumo das personas. Detalhes completos em `PERSONAS.md`.

- **Persona primária:** dev/criador usando um agent host (Claude Code, Codex, Cursor, etc.) que quer chamar WaveSpeed sem recriar a integração.
- **Persona secundária:** o próprio agent AI lendo o `SKILL.md` instalado, decidindo quando invocar a CLI `wavespeed-cli`.
- **Quem NÃO é o público:** quem precisa de Stable Diffusion local, ComfyUI graph workflows ou chamada direta a OpenAI/Anthropic sem passar pela WaveSpeed.

Veja `./PERSONAS.md` para objetivos, frustrações e contexto de uso de cada persona.

---

## Diferencial

- **One install, todo agent host.** `install.sh` detecta `~/.claude`, `~/.codex`, `~/.hermes`, `~/.openclaw`, `~/.cursor`, `~/.windsurf` e copia o `SKILL.md` certo em cada um.
- **CLI agnóstica de linguagem.** `wavespeed-cli` (`run`, `submit`, `result`, `cancel`, `upload`, `models`, `balance`, `llm`, `verify-webhook`) funciona igual independente do host que chama.
- **Venv isolada.** Deps Python (`wavespeed`, `requests`) ficam em `~/.local/share/wavespeed-skill/venv` — não polui ambiente do usuário.
- **Cobertura ampla.** Image, video, audio, avatar, LoRA stacking, serverless workers, batch jobs, webhooks com HMAC-SHA256 — tudo com exemplos em `examples/`.
- **Per-host frontmatter.** `agents/<host>/SKILL.md` tem o frontmatter exato esperado (Claude usa `allowed-tools`, Hermes usa yaml completo com `version`/`tags`/`prerequisites`, Codex/Cursor/Windsurf usam o mínimo).

---

## Métricas de sucesso

| Métrica | Baseline | Meta (3 meses) | Como medimos |
|---|---|---|---|
| Hosts de agent suportados | 7 (Claude, Codex, Hermes, OpenClaw, Cursor, Windsurf, generic) | 9+ (adicionar Aider, Kilo, OpenCode, Gemini CLI) | Pasta `agents/` |
| Tempo do `curl install.sh` ao primeiro `wavespeed-cli run` verde | TODO: humano medir | < 3 min | Cronômetro manual |
| Stars no GitHub | TODO: humano preencher | TODO: humano preencher | API GitHub |
| `verify-skill.sh` passa em dry-run sem `WAVESPEED_API_KEY` | sim | sim | CI |
| Cobertura de famílias de modelo no `references/models.md` | Z-Image, FLUX, Seedance, Kling, Veo, Luma, Wan, Qwen, Higgsfield, ace-step + LLMs | + lipsync, 3D, audio music | Diff do arquivo |

---

## Não-objetivos

- **Não somos um SDK.** A `wavespeed` Python SDK oficial já existe (`pip install wavespeed`). Aqui só é um wrapper fino + skills.
- **Não cobrimos ComfyUI graph workflows.** Quem precisa disso usa o repo `wavespeed-comfyui` da WaveSpeed.
- **Não substituímos clientes vendor.** Chamada direta à OpenAI/Anthropic/Google sem passar por WaveSpeed = use o SDK do vendor.
- **Não fazemos geração local.** Tudo é inferência via API WaveSpeed. Stable Diffusion local está fora.
- **Não somos afiliados à WaveSpeedAI Inc.** Repo MIT, community-maintained.

---

## Tese de longo prazo

Em 12 meses, qualquer agent host que apareça (existindo ou novo) tem um `SKILL.md` neste repo, instalável em uma linha, com a mesma CLI por trás. WaveSpeed vira a opção default quando o usuário pede "gera uma imagem/vídeo" no agent.

---

## Histórico

| Data | Versão | Mudança | Quem |
|---|---|---|---|
| 2026-05-07 | 0.1 | Reescrita inicial baseada em README/CLI/installer reais | Wesley Simplicio |
