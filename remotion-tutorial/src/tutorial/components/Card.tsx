import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fonts, colors, shadows } from '../theme';

type Props = {
  startFrame?: number;
  delay?: number;
  accent?: string;
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  minHeight?: number | string;
  children?: React.ReactNode;
};

export const Card: React.FC<Props> = ({
  startFrame = 0,
  delay = 0,
  accent = colors.violet,
  icon,
  title,
  description,
  footer,
  width = 380,
  minHeight = 280,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame - delay;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.8 },
  });
  const translate = interpolate(enter, [0, 1], [38, 0]);
  const glow = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translate}px)`,
        width,
        minHeight,
        padding: '28px 28px 26px',
        borderRadius: 24,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: `${shadows.card}, 0 0 ${40 * glow}px ${accent}33`,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(18px)',
        fontFamily: fonts.sans,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${accent}1a 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}33 0%, transparent 65%)`,
          filter: 'blur(20px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {icon ? (
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              display: 'grid',
              placeItems: 'center',
              background: `${accent}1f`,
              color: accent,
              border: `1px solid ${accent}55`,
              fontSize: 26,
            }}
          >
            {icon}
          </div>
        ) : null}
        <h3
          style={{
            margin: 0,
            color: colors.textPrimary,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: -0.4,
          }}
        >
          {title}
        </h3>
      </div>
      {description ? (
        <p
          style={{
            margin: 0,
            color: colors.textSecondary,
            fontSize: 18,
            lineHeight: 1.5,
            position: 'relative',
          }}
        >
          {description}
        </p>
      ) : null}
      {children ? (
        <div style={{ position: 'relative', flex: 1 }}>{children}</div>
      ) : null}
      {footer ? (
        <div
          style={{
            marginTop: 'auto',
            color: colors.textMuted,
            fontSize: 15,
            fontFamily: fonts.mono,
            position: 'relative',
          }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
};
