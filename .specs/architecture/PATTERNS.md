# Patterns — `WaveSpeedAI-Skills`

> Como escrever código aqui. Curto, opinativo, executável.
> Audiência: dev humano e agent AI. Se a regra não está aqui, vale o senso comum + revisão de PR.

---

## 1. Naming

| Item | Convenção | Exemplo bom | Exemplo ruim |
|---|---|---|---|
| Variáveis, funções Python | snake_case, inglês | `cmd_run`, `build_parser`, `terminal_statuses` | `RunCommand`, `cmdRun` |
| Constantes Python | UPPER_SNAKE | `API_BASE`, `LLM_BASE`, `TERMINAL_STATUSES` | `apiBase`, `Api_Base` |
| Handlers de subcomando | `cmd_<verbo>` | `cmd_run`, `cmd_submit`, `cmd_verify_webhook` | `run_cmd`, `runHandler` |
| Funções privadas | underscore prefix | `_key`, `_require_sdk` | `getKey`, `RequireSdk` |
| Arquivos Python | snake_case | `cli.py` | `Cli.py`, `cli-cli.py` |
| Pastas de host | kebab-case minúscula | `agents/claude/`, `agents/openclaw/` | `agents/Claude/`, `agents/Open_Claw/` |
| Frontmatter keys | kebab-case | `name`, `description`, `allowed-tools` | `allowedTools`, `Name` |
| Scripts Bash | kebab-case `.sh` | `install.sh`, `verify-skill.sh`, `wavespeed-cli` | `Install.sh`, `verify_skill.sh` |
| Branches | `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>` | `feat/add-aider-host`, `fix/balance-endpoint-fallback` | `feature1`, `wesley-branch` |
| Commits | conventional commits, em inglês | `feat: add aider host frontmatter`, `fix(cli): handle 404 on cmd_balance` | `update stuff` |

Regra de ouro: nome conta o quê, não o como. `do_request` é vago; `cmd_submit_and_poll` é claro.

---

## 2. Estrutura de pastas

Estrutura real (não mexer sem ADR):

```
.
├── README.md
├── install.sh                  # installer Bash, idempotente
├── pyproject.toml              # ruff + mypy (Python 3.10+)
├── cli/
│   ├── cli.py                  # 9 subcomandos: run/submit/result/cancel/upload/models/balance/llm/verify-webhook
│   └── wavespeed-cli           # shim Bash que ativa venv e exec cli.py
├── agents/
│   ├── claude/SKILL.md         # frontmatter: name, description, allowed-tools
│   ├── codex/SKILL.md
│   ├── cursor/SKILL.md
│   ├── windsurf/SKILL.md
│   ├── openclaw/SKILL.md
│   ├── hermes/SKILL.md         # frontmatter: name, description, version, tags, prerequisites
│   └── generic/SKILL.md
├── examples/                   # cookbook por caso de uso
│   ├── 01-text-to-image.md
│   ├── 02-image-to-video.md
│   ├── 03-text-to-video-with-audio.md
│   ├── 04-llm-chat.md
│   ├── 05-lora.md
│   ├── 06-serverless-worker.md
│   ├── 07-webhooks.md
│   └── 08-batch-jobs.md
├── references/                 # docs vivas
│   ├── error-codes.md
│   ├── models.md
│   ├── rate-limits.md
│   ├── rest-api.md
│   └── webhooks.md
├── scripts/
│   └── verify-skill.sh         # verifica install sem WAVESPEED_API_KEY
└── .specs/                     # specs deste agentic-starter (não toca em PR de feature)
```

Regra: agent host nunca importa de outro agent host. Cada `agents/<host>/SKILL.md` é independente.
Regra: `cli/cli.py` é único arquivo de lógica Python; se crescer >500 linhas, dividir em `cli/commands/`.

---

## 3. Como adicionar host de agent novo

Passo a passo curto:

1. Copiar `agents/generic/` → `agents/<novo-host>/`.
2. Ajustar frontmatter em `agents/<novo-host>/SKILL.md` conforme spec do host (ler doc oficial; ver `agents/claude/` vs `agents/hermes/` como referência das duas pontas).
3. Editar `install.sh: agent_path()` adicionando case do novo host (ex: `aider) echo "$HOME/.aider/skills/wavespeed" ;;`).
4. Adicionar host no array `KNOWN_AGENTS=(...)` para `--uninstall` cobrir.
5. Mencionar no `README.md` (tabela de hosts suportados).
6. Rodar `bash scripts/verify-skill.sh` (dry-run sem `WAVESPEED_API_KEY`).
7. Rodar `bash install.sh --agents <novo-host> --yes` em ambiente limpo e testar `wavespeed-cli --help`.

Critério de feito: install funciona, `--uninstall` remove, `verify-skill.sh` passa, README atualizado.

---

## 4. Como adicionar subcomando novo na CLI

1. Implementar `cmd_<nome>(args: argparse.Namespace) -> int` em `cli/cli.py`.
2. Adicionar subparser em `build_parser()` com `set_defaults(func=cmd_<nome>)` e flags claras (`--name`, `--input`, `--webhook-url`).
3. Se requer `wavespeed` SDK: chamar `_require_sdk()` no início. Se basta `requests`: não importar SDK.
4. Sempre validar `WAVESPEED_API_KEY` via `_key()` (exceto se subcomando for read-only de info local).
5. Status HTTP: tratar `>= 400` com mensagem útil e exit code adequado (`1` falha de domínio, `2` config).
6. Tarefas de polling: usar `TERMINAL_STATUSES` para sair do loop.
7. Documentar no `README.md` (seção "CLI commands") + criar exemplo em `examples/<NN>-<nome>.md`.
8. Atualizar `agents/<host>/SKILL.md` mencionando o novo subcomando — pelo menos no `generic`, ideal em todos.

Critério de feito: `wavespeed-cli <nome> --help` mostra ajuda; comando funciona com chave real; exemplo executado.

---

## 5. Como criar SKILL.md por host

Frontmatter mínimo (sempre presente):

```yaml
---
name: wavespeed
description: Generate images, videos, audio, and LLM completions through WaveSpeedAI.
---
```

Variantes por host:

- **Claude Code** — adicionar `allowed-tools: ["Bash(wavespeed-cli *)", "Bash(~/.local/bin/wavespeed-cli *)"]`.
- **Hermes** — adicionar `version: 1.0.0`, `tags: [media, llm, ai]`, `prerequisites: [wavespeed-cli]`.
- **Codex/Cursor/Windsurf/OpenClaw/generic** — frontmatter mínimo basta.

Corpo Markdown obrigatório:
- `## When to use` — bullets de triggers ("gera imagem", "lista modelos", "checa balance").
- `## Setup` — link pra `install.sh`.
- `## Commands` — lista dos subcomandos com exemplo `wavespeed-cli run ...`.
- `## Notes` — env vars (`WAVESPEED_API_KEY`, `WAVESPEED_WEBHOOK_SECRET`), troubleshooting.

Regra: `description` <= 160 chars (caber em listas de skills do host). Body pode ser longo.

---

## 6. Como criar teste

Hoje não há suíte de testes formal (gap conhecido — ver BACKLOG #1).

Quando a suíte for criada (`tests/` na raiz):

### Unit (pytest)
- Cobre `build_parser()` — cada subcomando aceita as flags certas.
- Cobre `_key()` — falha sem env, sucesso com env.
- Cobre lógica de polling — mock `requests` com sequência `pending → running → completed`.
- Cobre `verify_webhook` — assinatura correta vs incorreta.

### Integration
- Roda `cli.py llm <model> "ping"` contra um mock server local (`http.server` em fixture).
- Cobre `cmd_balance` com fallback de URL (`/account/balance` → `/balance` → `/billing/balance`).

### E2E
- `bash install.sh --yes` em container limpo, verificar `~/.local/bin/wavespeed-cli --help` retorna 0.
- `bash install.sh --uninstall --yes` remove tudo.

Regra: nenhum teste hoje chama API real (sem `WAVESPEED_API_KEY` exposta em CI).

---

## 7. Tratamento de erro

Princípio: falhar rápido com exit code claro e mensagem em stderr.

- Config faltando (`WAVESPEED_API_KEY` ausente): `print(...)` em stderr e `sys.exit(2)`. Mensagem aponta para `https://wavespeed.ai/accesskey`.
- SDK ausente em `cmd_run`: `_require_sdk()` levanta com instrução `pip install wavespeed` (mas pelo shim, isso é responsabilidade da venv — bug se acontece).
- HTTP 4xx/5xx: imprime status + body em stderr, exit code `1`.
- Task em status `failed`/`error`: stdout JSON normal, exit code `1` (permite scripting).
- Webhook signature inválida: stderr `INVALID`, exit code `1`. Válida: stdout `OK`, exit code `0`.
- Inesperado (KeyboardInterrupt, etc): deixa Python imprimir traceback. Não engolir exceção.

```python
def _key() -> str:
    key = os.environ.get("WAVESPEED_API_KEY")
    if not key:
        print("WAVESPEED_API_KEY not set", file=sys.stderr)
        sys.exit(2)
    return key
```

Nunca `try: ... except: pass`. Engolir é decisão consciente — comentar o porquê.

---

## 8. Logging

CLI síncrona, sem daemon. Logging hoje:

- **stdout** — payload JSON do resultado (parseável por agent host ou `jq`).
- **stderr** — mensagens de erro humano-legíveis e debug opcional.
- Sem framework (`logging` stdlib ainda não usado). Adicionar via ADR se necessário.

Nunca logar:
- `WAVESPEED_API_KEY` ou primeiros caracteres dela.
- `WAVESPEED_WEBHOOK_SECRET`.
- Header `Authorization: Bearer ...`.
- Body inteiro de prompts com PII (deixar usuário decidir via `--debug`).

Mascarar quando precisa contexto: `Authorization: Bearer ws_...` (truncar).

---

## 9. Validação

- Schema de input: validar antes de chamar HTTP. Hoje é mínimo (`json.loads(args.input)`).
- Tipos: `argparse` cuida do shape (str, int, bool). Domínio confia.
- Regra de negócio (model uuid existe, file existe pra upload): validar e dar mensagem útil.

```python
if not os.path.isfile(args.path):
    print(f"file not found: {args.path}", file=sys.stderr)
    sys.exit(2)
```

Nunca duplicar validação em 3 camadas. CLI valida uma vez; HTTP layer assume válido.

---

## 10. Imports

- Ordem: stdlib, libs externas, alias do projeto, relativo.
- `cli/cli.py` mantém imports no topo, agrupados.
- Sem `import *`. Importar o que usa.
- `wavespeed` SDK importado **dentro** de `_require_sdk()` (lazy) — evita travar quando não há SDK.

---

## 11. Frontmatter YAML

- Sempre quotar valores com `:` ou `,` ou `*`.
- `allowed-tools` é lista YAML, não string CSV: `["Bash(...)", "Bash(...)"]`.
- `description` em uma linha (sem `>` block scalar), pra hosts que não suportam.
- Nunca incluir credencial/segredo em frontmatter.

---

## 12. Quando dividir vs manter junto

- `cli/cli.py` é monolito intencional enquanto cabe em ~400 linhas. Acima disso: dividir em `cli/commands/<nome>.py` + `cli/__main__.py`.
- 3 ocorrências do mesmo helper = candidato a função em `cli/_util.py` (não criada ainda).
- Cada SKILL.md por host é cópia + ajuste de frontmatter — duplicação intencional pra cobrir spec de cada host. Não fatorar em template até frontmatter convergir.
- README.md > 600 linhas: extrair seção pra `docs/`.

Regra: simplicidade ganha de elegância. Código óbvio é melhor que código esperto.
