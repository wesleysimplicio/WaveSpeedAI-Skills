import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import { BackdropGradient } from './BackdropGradient';
import { ParticleField } from './ParticleField';
import { fonts, colors } from '../theme';

type Accent = 'violet' | 'cyan' | 'amber' | 'emerald';

type Props = {
  accent?: Accent;
  particleSeed: string;
  showParticles?: boolean;
  children: React.ReactNode;
  badge?: string;
  fadeOutAt?: number;
};

const ACCENT_PARTICLE: Record<Accent, string> = {
  violet: colors.violetSoft,
  cyan: colors.cyanSoft,
  amber: colors.amber,
  emerald: colors.emerald,
};

export const SceneFrame: React.FC<Props> = ({
  accent = 'violet',
  particleSeed,
  showParticles = true,
  children,
  badge,
  fadeOutAt,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const fadeOutStart = fadeOutAt ?? durationInFrames - 18;
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, fadeOutStart + 18],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity, fontFamily: fonts.sans }}>
      <BackdropGradient accent={accent} />
      {showParticles ? (
        <ParticleField
          seed={particleSeed}
          accent={ACCENT_PARTICLE[accent]}
          count={48}
        />
      ) : null}
      {badge ? (
        <div
          style={{
            position: 'absolute',
            top: 56,
            right: 72,
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${colors.border}`,
            color: colors.textSecondary,
            fontFamily: fonts.mono,
            fontSize: 16,
            letterSpacing: 1.4,
            backdropFilter: 'blur(8px)',
          }}
        >
          {badge}
        </div>
      ) : null}
      <AbsoluteFill style={{ padding: '110px 96px 90px' }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
