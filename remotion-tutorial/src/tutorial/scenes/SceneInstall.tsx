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

export const SceneInstall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useStrings().install;

  return (
    <SceneFrame accent="cyan" particleSeed="install" badge={t.badge}>
      <AbsoluteFill style={{ padding: '110px 96px 90px', display: 'flex', flexDirection: 'column', gap: 50 }}>
        <SceneTitle
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          accent={colors.cyanSoft}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56, alignItems: 'flex-start' }}>
          <CodeBlock
            title="bash"
            startFrame={20}
            width="100%"
            lineDuration={26}
            charsPerFrame={1.6}
            topAccent={colors.cyan}
            lines={[
              { text: t.code.commentInstall, comment: true },
              { prompt: '$', text: 'bash <(curl -fsSL https://wavespeed.ai/install.sh)' },
              { text: '' },
              { text: t.code.commentClone, comment: true },
              { prompt: '$', text: 'git clone https://github.com/wesleysimplicio/WaveSpeedAI-Skills' },
              { prompt: '$', text: 'bash install.sh --yes' },
              { text: '' },
              { text: t.code.commentAuth, comment: true },
              { prompt: '$', text: 'export WAVESPEED_API_KEY="ws_..."' },
              { prompt: '$', text: 'wavespeed-cli balance' },
            ]}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {t.steps.map((step, i) => {
              const enterFrame = 80 + i * 26;
              const local = frame - enterFrame;
              const enter = spring({
                frame: local,
                fps,
                config: { damping: 18, stiffness: 130 },
              });
              const translate = interpolate(enter, [0, 1], [24, 0]);
              return (
                <div
                  key={i}
                  style={{
                    opacity: enter,
                    transform: `translateX(${translate}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '18px 22px',
                    borderRadius: 16,
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    boxShadow: `0 18px 40px -22px rgba(8,8,30,0.85)`,
                    backdropFilter: 'blur(18px)',
                  }}
                >
                  <CheckBadge />
                  <div style={{ display: 'grid', gap: 4 }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: colors.textPrimary,
                        fontFamily: fonts.sans,
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        color: colors.textMuted,
                        fontFamily: fonts.mono,
                      }}
                    >
                      {step.detail}
                    </div>
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

const CheckBadge: React.FC = () => (
  <div
    style={{
      width: 44,
      height: 44,
      borderRadius: 14,
      display: 'grid',
      placeItems: 'center',
      background: `linear-gradient(135deg, ${colors.emerald} 0%, ${colors.cyan} 100%)`,
      boxShadow: `0 0 22px ${colors.emerald}66`,
      flexShrink: 0,
    }}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5l4 4 10-10"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
