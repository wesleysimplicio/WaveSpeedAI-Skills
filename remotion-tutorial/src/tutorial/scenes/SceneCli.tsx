import React from 'react';
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { SceneTitle } from '../components/SceneTitle';
import { CodeBlock } from '../components/CodeBlock';
import { fonts, colors } from '../theme';

const COMMAND_CARDS = [
  {
    label: 'models',
    description: 'Lista o catálogo vivo de 700+ modelos.',
    color: colors.violetSoft,
  },
  {
    label: 'run',
    description: 'Roda inferência async com polling automático.',
    color: colors.cyan,
  },
  {
    label: 'submit',
    description: 'Fire-and-forget com webhook de callback.',
    color: colors.amber,
  },
  {
    label: 'upload',
    description: 'Manda arquivo local e devolve URL hospedada.',
    color: colors.emerald,
  },
  {
    label: 'llm',
    description: 'Chat OpenAI-compatible para Claude, GPT, Gemini.',
    color: colors.rose,
  },
  {
    label: 'verify-webhook',
    description: 'Valida HMAC-SHA256 do callback do WaveSpeed.',
    color: colors.pink,
  },
];

export const SceneCli: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame accent="violet" particleSeed="cli" badge="05 · CLI EM AÇÃO">
      <AbsoluteFill style={{ padding: '110px 96px 90px', display: 'flex', flexDirection: 'column', gap: 50 }}>
        <SceneTitle
          eyebrow="Como o agent invoca a skill"
          title="wavespeed-cli — superfície única, contratos previsíveis"
          subtitle="Comandos curtos, JSON nas saídas. O agent gera, espera e devolve URLs prontas."
          accent={colors.violetSoft}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'flex-start' }}>
          <CodeBlock
            title="terminal — text→image (Z-Image turbo)"
            startFrame={20}
            width="100%"
            lineDuration={28}
            charsPerFrame={2}
            topAccent={colors.violet}
            lines={[
              { prompt: '$', text: 'export WAVESPEED_API_KEY="ws_..."' },
              { text: '' },
              { prompt: '$', text: 'wavespeed-cli models --names-only | head' },
              { text: 'wavespeed-ai/z-image/turbo', color: colors.cyanSoft },
              { text: 'wavespeed-ai/flux-dev', color: colors.cyanSoft },
              { text: 'wavespeed-ai/seedance-v2', color: colors.cyanSoft },
              { text: '' },
              { prompt: '$', text: "wavespeed-cli run wavespeed-ai/z-image/turbo \\" },
              { text: '    \'{"prompt":"Cat astronaut, neon cyberpunk"}\'' },
              { text: '' },
              { text: '✓ outputs[0]: https://cdn.wavespeed.ai/cat.png', color: colors.emerald },
            ]}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
            }}
          >
            {COMMAND_CARDS.map((cmd, i) => {
              const enterFrame = 90 + i * 14;
              const local = frame - enterFrame;
              const enter = spring({
                frame: local,
                fps,
                config: { damping: 18, stiffness: 130 },
              });
              const translate = interpolate(enter, [0, 1], [18, 0]);
              const scale = interpolate(enter, [0, 1], [0.92, 1]);
              return (
                <div
                  key={cmd.label}
                  style={{
                    opacity: enter,
                    transform: `translateY(${translate}px) scale(${scale})`,
                    padding: '18px 20px',
                    borderRadius: 16,
                    background: colors.surface,
                    border: `1px solid ${cmd.color}44`,
                    boxShadow: `0 14px 36px -22px rgba(8,8,30,0.85)`,
                    backdropFilter: 'blur(18px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    minHeight: 110,
                  }}
                >
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      color: cmd.color,
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    wavespeed-cli {cmd.label}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: colors.textSecondary,
                      lineHeight: 1.4,
                    }}
                  >
                    {cmd.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
