import React from 'react';
import { AbsoluteFill } from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { SceneTitle } from '../components/SceneTitle';
import { Card } from '../components/Card';
import { colors } from '../theme';

export const SceneWhatIsSkill: React.FC = () => {
  return (
    <SceneFrame accent="violet" particleSeed="what" badge="02 · O QUE É">
      <AbsoluteFill style={{ padding: '110px 96px 90px', display: 'flex', flexDirection: 'column', gap: 60 }}>
        <SceneTitle
          eyebrow="A skill em uma frase"
          title="Um manual que ensina o agent a chamar a WaveSpeedAI"
          subtitle="O arquivo SKILL.md vira capacidade nativa do seu agent — texto curto, frontmatter padronizado, comandos prontos."
          accent={colors.violetSoft}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}
        >
          <Card
            startFrame={28}
            delay={0}
            accent={colors.violet}
            icon={<MediaIcon />}
            title="700+ modelos de mídia"
            description={
              <>
                Z-Image, FLUX, Seedance, Kling, Veo, Luma, Wan, Qwen,
                Higgsfield, ace-step. Imagem, vídeo, áudio e avatares — tudo
                pelo mesmo gateway.
              </>
            }
            footer="wavespeed-ai/*"
            width="100%"
          />
          <Card
            startFrame={28}
            delay={12}
            accent={colors.cyan}
            icon={<ChatIcon />}
            title="290+ LLMs OpenAI-compatible"
            description={
              <>
                Claude, GPT, Gemini, DeepSeek, Llama, Mistral, Qwen, xAI.
                Mesma chave, mesma assinatura, sem trocar SDK por provedor.
              </>
            }
            footer="https://llm.wavespeed.ai/v1"
            width="100%"
          />
          <Card
            startFrame={28}
            delay={24}
            accent={colors.amber}
            icon={<TerminalIcon />}
            title="Uma CLI, qualquer agent"
            description={
              <>
                A skill empacota um shell único: <code>wavespeed-cli</code>.
                Async + polling automático, upload, webhooks, batch jobs.
              </>
            }
            footer="~/.local/bin/wavespeed-cli"
            width="100%"
          />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

const MediaIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="9" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.6" />
    <path d="M5 17l4-4 3 3 3-3 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const ChatIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="9" cy="11" r="1" fill="currentColor" />
    <circle cx="13" cy="11" r="1" fill="currentColor" />
    <circle cx="17" cy="11" r="1" fill="currentColor" />
  </svg>
);

const TerminalIcon: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 9l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M12 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
