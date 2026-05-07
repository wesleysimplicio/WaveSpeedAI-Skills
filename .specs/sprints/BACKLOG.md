# Backlog — WaveSpeedAI-Skills

Lista priorizada de tudo que precisa ser feito. Fonte da verdade de pendências do produto.

## Como usar este backlog

- Cada linha é item rastreável que vira `task.md` quando entra em sprint.
- Prioridades:
  - **P0** — bloqueador, sem isso o produto não funciona.
  - **P1** — importante, planejado pra próximas 1-2 sprints.
  - **P2** — desejável, fica no radar.
- Status: `todo`, `doing`, `done`.
- Ordenação: P0 → P1 → P2; dentro da prioridade, ordenar por sprint alvo.

## Regras de manutenção

- Nova ideia entra como P2 até alguém defender priorizar.
- `done` fica uma sprint no histórico, depois arquiva em `BACKLOG-archive.md`.
- Item 2 sprints como `todo` → reavalia.
- Mudança de prioridade ou de status `doing` atualiza tabela no mesmo PR.

## Backlog atual

Itens derivados do README ("Things that would help"), gaps observáveis no repo (sem `tests/`, sem `.github/workflows/`, sem `CHANGELOG.md`) e da seção "Tese de longo prazo" do `VISION.md`. Pesquisa de TODOs/FIXMEs em `cli/cli.py` e `install.sh`: zero matches. `gh issue list` (autenticado como `wesleysimplicio` em `wesleysimplicio/WaveSpeedAI-Skills`): zero issues abertas.

| #  | Título                                                              | Prioridade | Sprint alvo | Status |
|----|----------------------------------------------------------------------|-----------|-------------|--------|
| 1  | Criar suíte pytest mínima (`tests/unit/test_cli.py`) cobrindo `build_parser`, `_key`, `verify_webhook` | P0        | sprint-01   | todo   |
| 2  | Pipeline GitHub Actions: `ruff check` + `mypy` + `pytest` em PR    | P0        | sprint-01   | todo   |
| 3  | Workflow `dod.yml` que bloqueia merge sem ruff/mypy/pytest verdes  | P0        | sprint-01   | todo   |
| 4  | `verify-skill.sh` cobrir os 7 hosts em `agents/` (smoke test em container limpo) | P1        | sprint-01   | todo   |
| 5  | Adicionar host **Aider** em `agents/aider/SKILL.md` + entrada em `install.sh:agent_path` | P1        | sprint-02   | todo   |
| 6  | Adicionar host **Kilo Code** em `agents/kilo/SKILL.md`             | P1        | sprint-02   | todo   |
| 7  | Adicionar host **OpenCode** em `agents/opencode/SKILL.md`          | P1        | sprint-02   | todo   |
| 8  | Adicionar host **Gemini CLI** em `agents/gemini/SKILL.md`          | P1        | sprint-02   | todo   |
| 9  | Atualizar `references/models.md` com famílias **lipsync, 3D, audio music** | P1        | sprint-02   | todo   |
| 10 | Cookbook `examples/09-lipsync.md` cobrindo modelo lipsync end-to-end | P1        | sprint-03   | todo   |
| 11 | Cookbook `examples/10-3d-asset.md` para modelos 3D                 | P1        | sprint-03   | todo   |
| 12 | Cookbook `examples/11-audio-music.md` para family ace-step e similares | P1        | sprint-03   | todo   |
| 13 | Criar `CHANGELOG.md` raiz e adotar Keep a Changelog                | P1        | sprint-03   | todo   |
| 14 | Translatar `README.md` para `README.pt-BR.md`, `README.es.md`, `README.zh.md` | P2        | sprint-04   | todo   |
| 15 | Quando `cli/cli.py` ultrapassar 500 linhas, dividir em `cli/commands/<subcomando>.py` | P2        | backlog     | todo   |
| 16 | Avaliar empacotar como pacote PyPI (`wavespeedai-skills`) com console_scripts entrypoint | P2        | backlog     | todo   |
| 17 | Adicionar `--debug` global em `cli/cli.py` que ativa log HTTP request/response em stderr | P2        | backlog     | todo   |
| 18 | Cache local opcional de `wavespeed-cli upload` (hash → URL) pra evitar reupload | P2        | backlog     | todo   |
| 19 | ADR-001 explicando decisão de Python + argparse (vs Node/click)    | P2        | backlog     | todo   |
| 20 | ADR-002 explicando isolamento via venv dedicada (vs `pipx`)        | P2        | backlog     | todo   |

## Histórico recente (últimos done)

| #  | Título                                            | Sprint    | Concluído em |
|----|----------------------------------------------------|-----------|--------------|
| 0  | Bootstrap das specs (VISION, DOMAIN, PERSONAS, DESIGN, PATTERNS, BACKLOG) | sprint-00 | 2026-05-07   |

## Itens descartados ou movidos pra fora

- ComfyUI graph workflows — fora de escopo (existe `wavespeed-comfyui` separado).
- Suporte a chave múltipla (multi-tenant na CLI) — fora de escopo até alguém pedir.
- Geração local de mídia — fora de escopo (tudo é via API WaveSpeed).

## Próximas decisões pendentes

Itens que precisam de decisão de produto/arquitetura antes de entrar como task formal:

- Estratégia de versionamento (item #13): SemVer puro ou date-based (`YYYY.MM.DD`)?
- Pacote PyPI (item #16): mantém `install.sh` como caminho oficial ou substitui por `pipx install`?
- Cache de upload (item #18): TTL? Local? Como invalidar quando arquivo muda?
- Translation pipeline (item #14): tradução manual por PR ou via integração `humanizer`/LLM com revisão humana?
