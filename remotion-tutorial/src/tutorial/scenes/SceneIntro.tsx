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
import { Chip } from '../components/Chip';
import { fonts, colors, gradients } from '../theme';

const HOSTS = [
  { label: 'Claude', color: colors.violetSoft },
  { label: 'Codex', color: colors.cyan },
  { label: 'Hermes', color: colors.amber },
  { label: 'OpenClaw', color: colors.rose },
  { label: 'Cursor', color: colors.emerald },
  { label: 'Windsurf', color: colors.blue },
];

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const subSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 22, stiffness: 110 },
  });
  const taglineSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 24, stiffness: 110 },
  });

  return (
    <SceneFrame accent="violet" particleSeed="intro" badge="01 · INTRO">
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          textAlign: 'center',
        }}
      >
        <Logo size={140} startFrame={0} />
        <h1
          style={{
            margin: 0,
            opacity: titleSpring,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [40, 0])}px)`,
            fontSize: 132,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: -3,
            backgroundImage: gradients.brand,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: fonts.sans,
          }}
        >
          WaveSpeedAI Skill
        </h1>
        <h2
          style={{
            margin: 0,
            opacity: subSpring,
            transform: `translateY(${interpolate(subSpring, [0, 1], [20, 0])}px)`,
            fontSize: 36,
            fontWeight: 500,
            color: colors.textSecondary,
            letterSpacing: -0.4,
            maxWidth: 1200,
            fontFamily: fonts.sans,
          }}
        >
          Uma instalação. Todo agent. 700+ modelos de mídia e LLM em uma só CLI.
        </h2>
        <div
          style={{
            opacity: taglineSpring,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            marginTop: 8,
          }}
        >
          {HOSTS.map((h, i) => (
            <Chip
              key={h.label}
              label={h.label}
              color={h.color}
              startFrame={42}
              delay={i * 4}
            />
          ))}
        </div>
        <SignaturePulse />
      </AbsoluteFill>
    </SceneFrame>
  );
};

const SignaturePulse: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = 38;
  return (
    <div
      style={{
        marginTop: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 60,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const t = frame * 0.18 + i * 0.45;
        const h = 14 + Math.abs(Math.sin(t)) * 36 + Math.abs(Math.sin(t * 0.5)) * 8;
        const opacity = 0.35 + Math.abs(Math.sin(t * 0.7)) * 0.6;
        return (
          <div
            key={i}
            style={{
              width: 6,
              height: h,
              borderRadius: 3,
              background: i % 2 === 0 ? colors.violet : colors.cyan,
              opacity,
              boxShadow: `0 0 12px ${i % 2 === 0 ? colors.violet : colors.cyan}88`,
            }}
          />
        );
      })}
    </div>
  );
};
