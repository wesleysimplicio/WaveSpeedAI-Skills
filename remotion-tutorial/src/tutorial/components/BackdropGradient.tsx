import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors } from '../theme';

type Props = {
  /** Tint accent for this scene. */
  accent?: 'violet' | 'cyan' | 'amber' | 'emerald';
  intensity?: number;
};

const ACCENT_MAP: Record<NonNullable<Props['accent']>, string> = {
  violet: colors.violet,
  cyan: colors.cyan,
  amber: colors.amber,
  emerald: colors.emerald,
};

export const BackdropGradient: React.FC<Props> = ({
  accent = 'violet',
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const accentColor = ACCENT_MAP[accent];

  const orb1X = interpolate(frame, [0, 240], [10, 30], { extrapolateRight: 'extend' });
  const orb1Y = interpolate(frame, [0, 240], [20, 40], { extrapolateRight: 'extend' });
  const orb2X = interpolate(frame, [0, 240], [80, 60], { extrapolateRight: 'extend' });
  const orb2Y = interpolate(frame, [0, 240], [70, 55], { extrapolateRight: 'extend' });
  const orb3X = interpolate(frame, [0, 240], [50, 70], { extrapolateRight: 'extend' });
  const orb3Y = interpolate(frame, [0, 240], [80, 60], { extrapolateRight: 'extend' });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at top, ${colors.bgSoft} 0%, ${colors.bg} 45%, ${colors.bgDeep} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${orb1X}% ${orb1Y}%, ${accentColor}55 0%, transparent 35%)`,
          opacity: 0.85 * intensity,
          filter: 'blur(40px)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${orb2X}% ${orb2Y}%, ${colors.cyan}3a 0%, transparent 32%)`,
          opacity: 0.75 * intensity,
          filter: 'blur(60px)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${orb3X}% ${orb3Y}%, ${colors.violetDeep}40 0%, transparent 30%)`,
          opacity: 0.7 * intensity,
          filter: 'blur(80px)',
        }}
      />
      <NoiseOverlay />
      <Vignette />
    </AbsoluteFill>
  );
};

const NoiseOverlay: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.12,
      mixBlendMode: 'overlay',
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
    }}
  />
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);
