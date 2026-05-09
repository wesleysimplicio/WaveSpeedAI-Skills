import React from 'react';
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { SceneFrame } from '../components/SceneFrame';
import { Logo } from '../components/Logo';
import { fonts, colors, gradients } from '../theme';

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const cmdSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 22, stiffness: 110 },
  });
  const linkSpring = spring({
    frame: frame - 52,
    fps,
    config: { damping: 22, stiffness: 110 },
  });

  return (
    <SceneFrame accent="violet" particleSeed="outro" badge="07 · COMECE AGORA">
      <AbsoluteFill
        style={{
          padding: '110px 96px 90px',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 36,
        }}
      >
        <Logo size={120} />
        <h1
          style={{
            margin: 0,
            opacity: titleSpring,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [24, 0])}px)`,
            fontSize: 96,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: -2,
            backgroundImage: gradients.brand,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: fonts.sans,
          }}
        >
          Instale agora — uma linha
        </h1>

        <div
          style={{
            opacity: cmdSpring,
            transform: `translateY(${interpolate(cmdSpring, [0, 1], [16, 0])}px)`,
            padding: '22px 32px',
            borderRadius: 18,
            background: 'rgba(8, 9, 22, 0.8)',
            border: `1px solid ${colors.border}`,
            fontFamily: fonts.mono,
            fontSize: 26,
            color: colors.cyanSoft,
            boxShadow: `0 24px 60px -22px rgba(8,8,30,0.85), 0 0 80px ${colors.violet}33`,
            backdropFilter: 'blur(8px)',
            maxWidth: '90%',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: colors.violetSoft, marginRight: 14 }}>$</span>
          bash &lt;(curl -fsSL https://wavespeed.ai/install.sh)
        </div>

        <div
          style={{
            opacity: linkSpring,
            display: 'flex',
            gap: 24,
            marginTop: 12,
            fontFamily: fonts.sans,
            color: colors.textSecondary,
            fontSize: 22,
            alignItems: 'center',
          }}
        >
          <Pill label="github.com/wesleysimplicio/WaveSpeedAI-Skills" color={colors.violetSoft} />
          <Pill label="MIT licensed" color={colors.cyan} />
          <Pill label="agentskills.io spec" color={colors.amber} />
        </div>

        <p
          style={{
            opacity: linkSpring,
            margin: '12px 0 0',
            color: colors.textMuted,
            fontFamily: fonts.sans,
            fontSize: 20,
            letterSpacing: 0.4,
          }}
        >
          One install. Every agent. Full WaveSpeedAI inference platform.
        </p>
      </AbsoluteFill>
    </SceneFrame>
  );
};

const Pill: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div
    style={{
      padding: '10px 18px',
      borderRadius: 999,
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}55`,
      color,
      fontWeight: 600,
      letterSpacing: 0.4,
      fontSize: 18,
    }}
  >
    {label}
  </div>
);
