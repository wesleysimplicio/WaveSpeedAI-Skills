import React from 'react';

export type Locale = 'pt-BR' | 'en';

export const LOCALES: readonly Locale[] = ['pt-BR', 'en'] as const;

type Strings = {
  intro: {
    badge: string;
    subtitle: string;
  };
  whatIs: {
    badge: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: {
      media: { title: string; description: string };
      llm: { title: string; description: string };
      cli: { title: string; description: string };
    };
  };
  install: {
    badge: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    code: {
      commentInstall: string;
      commentClone: string;
      commentAuth: string;
    };
    steps: { label: string; detail: string }[];
  };
  hosts: {
    badge: string;
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  cli: {
    badge: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    codeTitle: string;
    cards: { label: string; description: string }[];
  };
  examples: {
    badge: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    items: {
      image: { label: string; prompt: string };
      video: { label: string; prompt: string };
      llm: { label: string; prompt: string };
    };
    chat: {
      user: string;
      assistant: string;
    };
  };
  outro: {
    badge: string;
    title: string;
    pills: string[];
    footer: string;
  };
};

export const STRINGS: Record<Locale, Strings> = {
  'pt-BR': {
    intro: {
      badge: '01 · INTRO',
      subtitle: 'Uma instalação. Todo agent. 700+ modelos de mídia e LLM em uma só CLI.',
    },
    whatIs: {
      badge: '02 · O QUE É',
      eyebrow: 'A skill em uma frase',
      title: 'Um manual que ensina o agent a chamar a WaveSpeedAI',
      subtitle:
        'O arquivo SKILL.md vira capacidade nativa do seu agent — texto curto, frontmatter padronizado, comandos prontos.',
      cards: {
        media: {
          title: '700+ modelos de mídia',
          description:
            'Z-Image, FLUX, Seedance, Kling, Veo, Luma, Wan, Qwen, Higgsfield, ace-step. Imagem, vídeo, áudio e avatares — tudo pelo mesmo gateway.',
        },
        llm: {
          title: '290+ LLMs OpenAI-compatible',
          description:
            'Claude, GPT, Gemini, DeepSeek, Llama, Mistral, Qwen, xAI. Mesma chave, mesma assinatura, sem trocar SDK por provedor.',
        },
        cli: {
          title: 'Uma CLI, qualquer agent',
          description:
            'A skill empacota um shell único: wavespeed-cli. Async + polling automático, upload, webhooks, batch jobs.',
        },
      },
    },
    install: {
      badge: '03 · INSTALAÇÃO',
      eyebrow: 'Setup em uma linha',
      title: 'curl, instala, configura — e já tem agent + CLI',
      subtitle:
        'O instalador detecta quais agents você usa e só copia o SKILL.md onde faz sentido.',
      code: {
        commentInstall: '# install em qualquer host conhecido',
        commentClone: '# ou clonado localmente',
        commentAuth: '# autentica e valida',
      },
      steps: [
        { label: 'Provisiona venv isolado', detail: '~/.local/share/wavespeed-skill/venv' },
        { label: 'Instala SDK Python', detail: 'pip install wavespeed requests' },
        { label: 'Dropa a CLI', detail: '~/.local/bin/wavespeed-cli' },
        {
          label: 'Detecta agents e copia o SKILL.md',
          detail: 'claude · codex · hermes · cursor · windsurf · openclaw',
        },
      ],
    },
    hosts: {
      badge: '04 · ONDE FUNCIONA',
      eyebrow: 'Mesma skill, todos os agents',
      title: 'Sete hosts suportados — frontmatter por host',
      subtitle:
        'O instalador escolhe o SKILL.md certo para cada diretório de agent. Você só roda uma vez.',
    },
    cli: {
      badge: '05 · CLI EM AÇÃO',
      eyebrow: 'Como o agent invoca a skill',
      title: 'wavespeed-cli — superfície única, contratos previsíveis',
      subtitle:
        'Comandos curtos, JSON nas saídas. O agent gera, espera e devolve URLs prontas.',
      codeTitle: 'terminal — text→image (Z-Image turbo)',
      cards: [
        { label: 'models', description: 'Lista o catálogo vivo de 700+ modelos.' },
        { label: 'run', description: 'Roda inferência async com polling automático.' },
        { label: 'submit', description: 'Fire-and-forget com webhook de callback.' },
        { label: 'upload', description: 'Manda arquivo local e devolve URL hospedada.' },
        { label: 'llm', description: 'Chat OpenAI-compatible para Claude, GPT, Gemini.' },
        { label: 'verify-webhook', description: 'Valida HMAC-SHA256 do callback do WaveSpeed.' },
      ],
    },
    examples: {
      badge: '06 · O QUE DÁ PRA FAZER',
      eyebrow: 'Three modalities, one CLI',
      title: 'Imagem, vídeo e LLM com o mesmo padrão de chamada',
      subtitle:
        'Async por padrão. URLs prontas em outputs[0]. Webhooks opcionais para fila longa.',
      items: {
        image: { label: 'Text → Image', prompt: 'cat astronaut, neon cyberpunk' },
        video: { label: 'Image → Video', prompt: 'camera dolly in, soft lights' },
        llm: { label: 'Chat → LLM', prompt: 'resuma em uma frase' },
      },
      chat: {
        user: 'Resuma o WaveSpeedAI numa frase.',
        assistant:
          'Plataforma única para imagem, vídeo, áudio e LLM em 700+ modelos.',
      },
    },
    outro: {
      badge: '07 · COMECE AGORA',
      title: 'Instale agora — uma linha',
      pills: [
        'github.com/wesleysimplicio/WaveSpeedAI-Skills',
        'MIT licensed',
        'agentskills.io spec',
      ],
      footer: 'One install. Every agent. Full WaveSpeedAI inference platform.',
    },
  },
  en: {
    intro: {
      badge: '01 · INTRO',
      subtitle: 'One install. Every agent. 700+ media + LLM models in a single CLI.',
    },
    whatIs: {
      badge: '02 · WHAT IT IS',
      eyebrow: 'The skill, in one sentence',
      title: 'A manual that teaches your agent to call WaveSpeedAI',
      subtitle:
        'The SKILL.md file becomes a native capability of your agent — short text, standardized frontmatter, ready-to-run commands.',
      cards: {
        media: {
          title: '700+ media models',
          description:
            'Z-Image, FLUX, Seedance, Kling, Veo, Luma, Wan, Qwen, Higgsfield, ace-step. Image, video, audio and avatars — all through one gateway.',
        },
        llm: {
          title: '290+ OpenAI-compatible LLMs',
          description:
            'Claude, GPT, Gemini, DeepSeek, Llama, Mistral, Qwen, xAI. Same key, same signature, no SDK swap per provider.',
        },
        cli: {
          title: 'One CLI, any agent',
          description:
            'The skill ships a single shell: wavespeed-cli. Async + automatic polling, upload, webhooks, batch jobs.',
        },
      },
    },
    install: {
      badge: '03 · INSTALL',
      eyebrow: 'One-line setup',
      title: 'curl, install, configure — and the agent + CLI are ready',
      subtitle:
        'The installer detects which agents you use and only copies SKILL.md where it makes sense.',
      code: {
        commentInstall: '# install on any known host',
        commentClone: '# or clone locally',
        commentAuth: '# authenticate and verify',
      },
      steps: [
        { label: 'Provisions an isolated venv', detail: '~/.local/share/wavespeed-skill/venv' },
        { label: 'Installs the Python SDK', detail: 'pip install wavespeed requests' },
        { label: 'Drops the CLI shim', detail: '~/.local/bin/wavespeed-cli' },
        {
          label: 'Detects agents and copies SKILL.md',
          detail: 'claude · codex · hermes · cursor · windsurf · openclaw',
        },
      ],
    },
    hosts: {
      badge: '04 · WHERE IT RUNS',
      eyebrow: 'Same skill, every agent',
      title: 'Seven supported hosts — frontmatter per host',
      subtitle:
        'The installer picks the right SKILL.md for each agent directory. You only run it once.',
    },
    cli: {
      badge: '05 · CLI IN ACTION',
      eyebrow: 'How the agent invokes the skill',
      title: 'wavespeed-cli — single surface, predictable contracts',
      subtitle:
        'Short commands, JSON outputs. The agent generates, waits and hands back ready URLs.',
      codeTitle: 'terminal — text→image (Z-Image turbo)',
      cards: [
        { label: 'models', description: 'Live catalog of 700+ models.' },
        { label: 'run', description: 'Async inference with automatic polling.' },
        { label: 'submit', description: 'Fire-and-forget with a webhook callback.' },
        { label: 'upload', description: 'Sends a local file, returns the hosted URL.' },
        { label: 'llm', description: 'OpenAI-compatible chat for Claude, GPT, Gemini.' },
        { label: 'verify-webhook', description: 'Validates the WaveSpeed HMAC-SHA256 callback.' },
      ],
    },
    examples: {
      badge: '06 · WHAT YOU CAN BUILD',
      eyebrow: 'Three modalities, one CLI',
      title: 'Image, video and LLM with the same call shape',
      subtitle:
        'Async by default. Ready URLs at outputs[0]. Optional webhooks for long queues.',
      items: {
        image: { label: 'Text → Image', prompt: 'cat astronaut, neon cyberpunk' },
        video: { label: 'Image → Video', prompt: 'camera dolly in, soft lights' },
        llm: { label: 'Chat → LLM', prompt: 'summarize in one sentence' },
      },
      chat: {
        user: 'Summarize WaveSpeedAI in one sentence.',
        assistant: 'One platform for image, video, audio and LLM across 700+ models.',
      },
    },
    outro: {
      badge: '07 · GET STARTED',
      title: 'Install now — one line',
      pills: [
        'github.com/wesleysimplicio/WaveSpeedAI-Skills',
        'MIT licensed',
        'agentskills.io spec',
      ],
      footer: 'One install. Every agent. Full WaveSpeedAI inference platform.',
    },
  },
};

export const LocaleContext = React.createContext<Locale>('pt-BR');

export const useStrings = () => {
  const locale = React.useContext(LocaleContext);
  return STRINGS[locale];
};

export const useLocale = () => React.useContext(LocaleContext);
