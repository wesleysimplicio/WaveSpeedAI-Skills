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
import { useStrings } from '../i18n';

const CARD_COLORS = [
  colors.violetSoft,
  colors.cyan,
  colors.amber,
  colors.emerald,
  colors.rose,
  colors.pink,
];

export const SceneCli: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useStrings().cli;

  return (
    <SceneFrame accent="violet" particleSeed="cli" badge={t.badge}>
      <AbsoluteFill style={{ padding: '110px 96px 90px', display: 'flex', flexDirection: 'column', gap: 50 }}>
        <SceneTitle
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          accent={colors.violetSoft}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'flex-start' }}>
          <CodeBlock
            title={t.codeTitle}
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
            {t.cards.map((cmd, i) => {
              const enterFrame = 90 + i * 14;
              const local = frame - enterFrame;
              const enter = spring({
                frame: local,
                fps,
                config: { damping: 18, stiffness: 130 },
              });
              const translate = interpolate(enter, [0, 1], [18, 0]);
              const scale = interpolate(enter, [0, 1], [0.92, 1]);
              const cardColor = CARD_COLORS[i % CARD_COLORS.length];
              return (
                <div
                  key={cmd.label}
                  style={{
                    opacity: enter,
                    transform: `translateY(${translate}px) scale(${scale})`,
                    padding: '18px 20px',
                    borderRadius: 16,
                    background: colors.surface,
                    border: `1px solid ${cardColor}44`,
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
                      color: cardColor,
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
