# PERSONAS — WaveSpeedAI-Skills

Quem usa este repo. Cada persona é um arquétipo: representa um grupo real com objetivos, frustrações e contexto comuns. Decisões de produto e features se justificam contra estas personas.

> Este projeto não tem schema de auth próprio (é um pacote de skills + CLI). Os "roles" são inferidos do README, do `install.sh` e da forma como `agents/<host>/SKILL.md` é consumido.

> Regra: se uma feature não move a agulha de pelo menos uma persona aqui, ela não entra no backlog.

---

## Persona 1 — Dev / criador usando agent host

**Arquétipo:** humano que opera um agent host (Claude Code, Codex, Cursor, Windsurf, OpenClaw) e quer gerar mídia/LLM via WaveSpeed sem reinventar a integração.

### Quem é

- **Papel/profissão:** dev full-stack, ML engineer, designer técnico, founder solo.
- **Familiaridade com tech:** alta. Vive no terminal, usa `git`, sabe ler `SKILL.md` e frontmatter YAML.
- **Familiaridade com WaveSpeed:** baixa-a-média. Tem conta, gerou key em `https://wavespeed.ai/accesskey`, talvez já chamou a SDK Python uma vez.

### Objetivos

- Rodar `wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"..."}'` e ver imagem em segundos, sem ler 30 páginas de doc.
- Subir um arquivo local (`upload ./hero.png`) e usar a URL como input num modelo image-to-video.
- Disparar trabalhos longos com `--webhook-url` e validar callback via `verify-webhook` sem precisar de Flask.
- Trocar de host (Claude para Codex para Cursor) sem reescrever a skill.
- Listar modelos, conferir saldo, cancelar tarefa travada — tudo de uma CLI só.

### Frustrações / dores

- Cada agent host tem path/frontmatter diferente para `SKILL.md`; copiar manual cansa.
- Boilerplate de submit/poll é o mesmo todo dia, mas cada projeto reescreve do zero.
- A SDK `wavespeed` é Python-only; quem está no Node/Go/Rust precisa do REST nu.
- Webhook signature em produção é HMAC-SHA256 sobre raw bytes — fácil de errar parsing.
- `pip install wavespeed` poluindo `site-packages` global.

### Contexto de uso

- **Ambiente:** terminal + um dos agent hosts + opcional editor (VS Code/Cursor).
- **Frequência:** múltiplas vezes por dia em sprints criativos; semanal em manutenção.
- **Sessão típica:** 30 min a 4h iterando prompts, modelos e parâmetros.
- **Trigger principal:** "preciso de uma imagem/vídeo agora dentro do meu agent".

### Métricas que importam

- Tempo do `bash install.sh` ao primeiro `run` verde < 3 min.
- 0 deps Python na máquina do usuário fora da venv dedicada.
- 1 chave (`WAVESPEED_API_KEY`) cobre todos os comandos.

---

## Persona 2 — Agent AI consumindo o `SKILL.md`

**Arquétipo:** o próprio agent (Claude Code, Codex, Hermes, OpenClaw, Cursor, Windsurf) lendo `SKILL.md` instalado e decidindo quando invocar `wavespeed-cli`.

### Quem é

- Não é humano. É um LLM seguindo descrição de skill com `name`, `description`, `allowed-tools`.
- Capacidades: shell exec via `Bash` (Claude), tool-use estruturado (outros).
- Limitações: janela de contexto, sem memória entre sessões, depende do `SKILL.md` bem escrito.

### Objetivos

- Detectar trigger ("gera uma imagem de X", "usa o modelo `wavespeed-ai/...`", "lista modelos", "checa balance") e disparar o comando certo.
- Não inventar paths fora dos `allowed-tools` (`Bash(wavespeed-cli *)`, `Bash(~/.local/bin/wavespeed-cli *)`).
- Não tentar ComfyUI / OpenAI direto se a skill diz "use WaveSpeed" — manter escopo.
- Reusar `wavespeed-cli upload` para inputs em vez de tentar passar binário inline.

### Frustrações / dores

- Frontmatter inconsistente entre hosts: o que funciona em Claude (`allowed-tools`) é ruído em Cursor.
- `description` curta demais perde contexto; longa demais consome tokens.
- Sem exemplo concreto, o agent inventa flag que não existe.

### Contexto de uso

- **Trigger:** mensagem do humano casa com algum bullet do "When to use" do `SKILL.md`.
- **Frequência:** várias por sessão.
- **Sessão típica:** 1 ou 2 chamadas `run`/`submit`/`llm` por turno.

### Métrica que importa

- % de invocações em que o agent escolhe o subcomando certo na primeira tentativa.
- 0 alucinações de flag/argumento (toda flag usada existe em `cli/cli.py:build_parser`).

---

## Persona 3 — Maintainer do repo

**Arquétipo:** Wesley Simplicio + contribuidores via PR.

### Quem é

- **Papel:** mantém `agents/<host>/SKILL.md`, `cli/cli.py`, `examples/`, `references/`, `install.sh`.
- **Familiaridade:** alta com WaveSpeed, com a `agentskills.io` spec e com diferenças entre hosts.

### Objetivos

- Adicionar host novo (Aider, Kilo, OpenCode, Gemini CLI) só copiando `agents/generic/` e ajustando frontmatter.
- Garantir que `install.sh --yes` é idempotente.
- `scripts/verify-skill.sh` continua passando após cada PR.
- Atualizar `references/models.md` quando WaveSpeed solta família nova (lipsync, 3D, audio music).

### Frustrações / dores

- Mudança de schema na REST API da WaveSpeed quebra `cmd_balance` / `cmd_result` silenciosamente — só vê quando alguém abre issue.
- PR de host novo às vezes vem com frontmatter errado; precisa de checklist.

### Contexto de uso

- **Ambiente:** GitHub + terminal local.
- **Frequência:** semanal.
- **Trigger:** issue/PR aberto, release nova da WaveSpeed.

### Métricas que importam

- `scripts/verify-skill.sh` verde em todo PR.
- Tempo de review de PR de host novo < 1 dia.

---

## Histórico

| Data | Mudança | Quem |
|---|---|---|
| 2026-05-07 | Reescrita com personas inferidas do README + `install.sh` + estrutura de `agents/`. | Wesley Simplicio |
