# WaveSpeedAI Skills para Claude, Codex, Hermes, OpenClaw, outros

> 🇧🇷 Versão em português. Read this in English: [README.md](README.md).

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skill Spec](https://img.shields.io/badge/spec-agentskills.io-555.svg)](https://agentskills.io)
[![WaveSpeedAI](https://img.shields.io/badge/platform-WaveSpeedAI-7c3aed.svg)](https://wavespeed.ai)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-success.svg)](CONTRIBUTING.md)

> Uma instalação. Todo agente. Plataforma WaveSpeedAI completa — 700+ modelos de mídia e 290+ LLMs compatíveis com OpenAI — conectada em Claude Code, Codex, Hermes Agent, OpenClaw, Cursor, Windsurf e qualquer host que siga a spec [agentskills.io](https://agentskills.io) `SKILL.md`.

```bash
# Instalação one-line (interativo, escolhe os agentes que você tem)
bash <(curl -fsSL https://raw.githubusercontent.com/wesleysimplicio/WaveSpeedAI-Skills/main/install.sh)
```

```bash
# Gera algo
export WAVESPEED_API_KEY="ws_..."        # https://wavespeed.ai/accesskey
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat in tuxedo"}'
```

---

## Por que existe

A WaveSpeedAI dá uma chave única pra inferência de imagem, vídeo, áudio e LLM em 700+ modelos. O SDK Python deles é bom. A doc é boa. Mas cada host de agente (Claude Code, Codex, Hermes, OpenClaw, …) lê arquivos `SKILL.md` em diretórios e com frontmatter ligeiramente diferentes, e não há um bundle canônico bem testado cobrindo todos.

Este repo resolve isso:

- **Arquivos SKILL.md por agente** com o frontmatter certo pra cada host.
- **CLI agnóstica de linguagem** (`wavespeed-cli`) — a skill funciona igual independente de qual agente invoca.
- **Instalador one-line** que detecta quais diretórios de agentes existem e instala só onde faz sentido.
- **Exemplos + docs de referência** mais profundos que skill típica — padrões submit/poll, verificação de webhook, batch, LoRA stacking, workers serverless.

MIT, mantido pela comunidade, sem afiliação com WaveSpeedAI.

## Hosts suportados

| Host | Caminho do SKILL | Estilo de frontmatter |
|---|---|---|
| **Claude Code** | `~/.claude/skills/wavespeed/SKILL.md` | `name`, `description`, `allowed-tools` |
| **Codex** | `~/.codex/skills/wavespeed/SKILL.md` | `name`, `description` |
| **Hermes Agent** | `~/.hermes/skills/creative/wavespeed/SKILL.md` | yaml completo (version, author, tags, prerequisites) |
| **OpenClaw** | `~/.openclaw/skills/wavespeed/SKILL.md` | name, description, version, tags |
| **Cursor** | `~/.cursor/skills/wavespeed/SKILL.md` | name, description |
| **Windsurf** | `~/.windsurf/skills/wavespeed/SKILL.md` | name, description |
| **Genérico** | `~/.config/agent-skills/wavespeed/SKILL.md` | portátil, copia onde quiser |

Os arquivos `agents/<host>/SKILL.md` deste repo são fonte canônica. O instalador copia o certo pro lugar certo.

## O que vem junto

- `wavespeed-cli run` / `submit` / `result` / `cancel` — ciclo completo de predição
- `wavespeed-cli upload` — arquivo local → URL hospedada pra fluxos image-to-X
- `wavespeed-cli models` — catálogo vivo (com `--filter` e `--names-only`)
- `wavespeed-cli balance` — saldo da conta
- `wavespeed-cli llm` — chat completions compatível OpenAI, com `--system`, `--json-mode`, `--stream`, `--temperature`, `--max-tokens`, `--raw`
- `wavespeed-cli verify-webhook` — helper de verificação HMAC-SHA256
- [Catálogo curado](references/models.md) cobrindo Z-Image, FLUX, Seedance, Kling, Veo, Luma, Wan, Qwen, Higgsfield, ace-step, e a lista de LLMs (Anthropic, OpenAI, Google, Meta, DeepSeek, Mistral, Qwen, xAI, Cohere, …)
- Docs de referência pra [REST](references/rest-api.md), [erros](references/error-codes.md), [rate limits](references/rate-limits.md), [webhooks](references/webhooks.md)
- Cookbook: [text→image](examples/01-text-to-image.md) · [image→video](examples/02-image-to-video.md) · [text→video c/ áudio](examples/03-text-to-video-with-audio.md) · [LLM chat](examples/04-llm-chat.md) · [LoRA](examples/05-lora.md) · [workers serverless](examples/06-serverless-worker.md) · [webhooks](examples/07-webhooks.md) · [batch](examples/08-batch-jobs.md)

## Instalação

### One-liner (recomendado)

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/wesleysimplicio/WaveSpeedAI-Skills/main/install.sh)
```

O instalador:

1. Provisiona venv Python isolado em `~/.local/share/wavespeed-skill/venv` (usa `uv` se disponível; fallback `python3 -m venv`).
2. Instala SDK `wavespeed` Python + `requests` no venv.
3. Coloca shim `wavespeed-cli` em `~/.local/bin/`.
4. Detecta diretórios de agente já existentes (`~/.claude`, `~/.codex`, `~/.hermes`, `~/.openclaw`, `~/.cursor`, `~/.windsurf`) e pergunta antes de instalar cada `SKILL.md`.

Flags:

```bash
bash install.sh --yes                       # não-interativo, instala em todos
bash install.sh --agents claude,codex       # apenas esses hosts
bash install.sh --uninstall                 # remove venv + CLI + todos os SKILLs
```

### Clone e instala localmente

```bash
git clone https://github.com/wesleysimplicio/WaveSpeedAI-Skills.git
cd WaveSpeedAI-Skills
bash install.sh
```

### Manual (um host específico)

```bash
mkdir -p ~/.claude/skills/wavespeed
cp agents/claude/SKILL.md ~/.claude/skills/wavespeed/SKILL.md
```

…então instale a CLI:

```bash
mkdir -p ~/.local/share/wavespeed-skill
cp cli/cli.py ~/.local/share/wavespeed-skill/cli.py
cp cli/wavespeed-cli ~/.local/bin/wavespeed-cli
chmod +x ~/.local/bin/wavespeed-cli
uv venv --python 3.12 ~/.local/share/wavespeed-skill/venv
uv pip install --python ~/.local/share/wavespeed-skill/venv/bin/python wavespeed requests
```

## Configuração

```bash
export WAVESPEED_API_KEY="ws_..."     # https://wavespeed.ai/accesskey
```

Overrides opcionais:

```bash
export WAVESPEED_API_BASE="https://api.wavespeed.ai/api/v3"
export WAVESPEED_LLM_BASE="https://llm.wavespeed.ai/v1"
export WAVESPEED_WEBHOOK_SECRET="ws_secret_..."   # pra verify-webhook
```

Persista em `~/.zshrc` / `~/.bashrc` / `~/.config/fish/config.fish`.

## Uso

### Imagem

```bash
# Rápido (sub-2s)
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat in tuxedo"}'

# Qualidade
wavespeed-cli run wavespeed-ai/flux-dev \
  '{"prompt":"Octopus chess game, studio lighting","size":"1024x1024"}'
```

### Vídeo

```bash
URL=$(wavespeed-cli upload ./hero.png)
wavespeed-cli run wavespeed-ai/seedance-v2 \
  "$(jq -nc --arg u "$URL" '{image:$u, prompt:"slow camera dolly in"}')"

wavespeed-cli run wavespeed-ai/veo-3 '{"prompt":"thunderstorm at dusk, cinematic"}'
```

### Async + webhook (recomendado pra vídeo)

```bash
ID=$(wavespeed-cli submit wavespeed-ai/veo-3 '{"prompt":"..."}' \
       --webhook-url https://your.app/wavespeed/cb \
     | jq -r '.data.id')
wavespeed-cli result "$ID" --wait
```

### LLM

```bash
wavespeed-cli llm anthropic/claude-opus-4.6 "Resuma WaveSpeed em uma linha."
wavespeed-cli llm openai/gpt-5.2-pro "..." --system "Seja terso." --stream
wavespeed-cli llm google/gemini-3-flash-preview '{"city":"Lisbon"}' --json-mode
```

### Python

```python
import wavespeed
out = wavespeed.run("wavespeed-ai/z-image/turbo", {"prompt": "Cat"})
print(out["outputs"][0])
```

Rode scripts contra o venv dedicado:

```bash
~/.local/share/wavespeed-skill/venv/bin/python myscript.py
```

Ou ad-hoc:

```bash
uv run --with wavespeed python myscript.py
```

## Verificando que tudo funciona

```bash
wavespeed-cli --version
wavespeed-cli models --names-only | head
wavespeed-cli balance
wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"hello world"}'
```

Se algum passo der erro, veja [troubleshooting](#troubleshooting).

## Troubleshooting

- **`WAVESPEED_API_KEY not set`** — exporte; chave em https://wavespeed.ai/accesskey.
- **`wavespeed-cli: command not found`** — confira `~/.local/bin` no `$PATH`. O instalador avisa quando falta.
- **`401 Unauthorized`** — chave revogada ou conta errada; reemita.
- **`402 insufficient balance`** — confira `wavespeed-cli balance`; alguns modelos são tier-locked. Veja [rate-limits.md](references/rate-limits.md).
- **`429 rate-limited`** — recue; respeite `Retry-After`. Veja [batch-jobs.md](examples/08-batch-jobs.md).
- **Trava pra sempre** — modelo travou ou timeout default 36000s muito alto. Cancele com `wavespeed-cli cancel <id>` e resubmit com `--timeout 600`.
- **Webhook signature inválida** — você fez parse do body antes de hashear; hashe os bytes brutos. Veja [webhooks.md](references/webhooks.md).
- **wavespeed.ai/docs com 500** — soluço ocasional. Use READMEs do GitHub como backup (`WaveSpeedAI/wavespeed-python`, `WaveSpeedAI/wavespeed-javascript`).

## Contribuindo

PRs bem-vindos. Veja [CONTRIBUTING.md](CONTRIBUTING.md). Por favor seja gentil — veja [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Coisas que ajudam:

- Adicionar SKILL.md pra um host ainda não coberto (Aider, Kilo Code, OpenCode, Gemini CLI, outros em [agentskills.io](https://agentskills.io)).
- Atualizar a lista curada de modelos quando WaveSpeed soltar famílias novas.
- Adicionar entrada de cookbook pra família que falta (ex: lipsync, 3D, áudio musical).
- Traduzir o README pra outras línguas (ES, ZH).

## Reconhecimentos

- [WaveSpeedAI](https://wavespeed.ai) por construir a plataforma e os SDKs.
- Comunidade [agentskills.io](https://agentskills.io) pela spec SKILL.md.
- `al1enjesus/wavespeed` (marketplace OpenClaw) — skill comunitária anterior que provou demanda por isso.

## Licença

MIT — veja [LICENSE](LICENSE). Sem afiliação com WaveSpeedAI Inc. Marcas registradas pertencem aos respectivos titulares.

## Links

- [WaveSpeedAI](https://wavespeed.ai) · [Docs](https://wavespeed.ai/docs) · [Models](https://wavespeed.ai/models) · [API key](https://wavespeed.ai/accesskey) · [Discord](https://discord.gg/wavespeed)
- [Python SDK](https://github.com/WaveSpeedAI/wavespeed-python) · [JavaScript SDK](https://github.com/WaveSpeedAI/wavespeed-javascript) · [ComfyUI](https://github.com/WaveSpeedAI/wavespeed-comfyui) · [n8n](https://github.com/WaveSpeedAI/wavespeed-n8n)
- [Spec da skill](https://agentskills.io)
