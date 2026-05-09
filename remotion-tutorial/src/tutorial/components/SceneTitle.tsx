import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { fonts, colors, gradients } from '../theme';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string;
  align?: 'left' | 'center';
  startFrame?: number;
};

export const SceneTitle: React.FC<Props> = ({
  eyebrow,
  title,
  subtitle,
  accent = colors.violetSoft,
  align = 'left',
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const eyebrowSpring = spring({
    frame: local,
    fps,
    config: { damping: 20, stiffness: 110 },
  });
  const titleSpring = spring({
    frame: local - 6,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const subSpring = spring({
    frame: local - 14,
    fps,
    config: { damping: 22, stiffness: 110 },
  });

  const eyebrowY = interpolate(eyebrowSpring, [0, 1], [12, 0]);
  const titleY = interpolate(titleSpring, [0, 1], [28, 0]);
  const subY = interpolate(subSpring, [0, 1], [16, 0]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        gap: 12,
        fontFamily: fonts.sans,
      }}
    >
      {eyebrow ? (
        <div
          style={{
            opacity: eyebrowSpring,
            transform: `translateY(${eyebrowY}px)`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 18px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${colors.border}`,
            color: accent,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            backdropFilter: 'blur(6px)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 16px ${accent}`,
            }}
          />
          {eyebrow}
        </div>
      ) : null}
      <h1
        style={{
          margin: 0,
          opacity: titleSpring,
          transform: `translateY(${titleY}px)`,
          fontSize: 86,
          lineHeight: 1.05,
          fontWeight: 800,
          letterSpacing: -1.5,
          color: colors.textPrimary,
          backgroundImage: gradients.brand,
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 8px 30px rgba(139,92,246,0.35)',
        }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          style={{
            margin: 0,
            opacity: subSpring,
            transform: `translateY(${subY}px)`,
            fontSize: 30,
            color: colors.textSecondary,
            maxWidth: 1100,
            fontWeight: 500,
            lineHeight: 1.35,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};
