import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fonts, colors } from '../theme';

type Props = {
  name: string;
  monogram: string;
  path: string;
  color: string;
  startFrame?: number;
  delay?: number;
};

export const HostBadge: React.FC<Props> = ({
  name,
  monogram,
  path,
  color,
  startFrame = 0,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame - delay;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 18, stiffness: 130, mass: 0.7 },
  });
  const translate = interpolate(enter, [0, 1], [22, 0]);
  const scale = interpolate(enter, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${translate}px) scale(${scale})`,
        width: 280,
        padding: '20px 22px',
        borderRadius: 20,
        background: colors.surface,
        border: `1px solid ${color}55`,
        boxShadow: `0 18px 40px -22px rgba(8,8,30,0.85), 0 0 0 1px ${color}22`,
        backdropFilter: 'blur(18px)',
        fontFamily: fonts.sans,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${color} 0%, ${color}88 100%)`,
            color: 'white',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: 0,
            boxShadow: `0 0 24px ${color}66`,
          }}
        >
          {monogram}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.textPrimary,
            letterSpacing: -0.2,
          }}
        >
          {name}
        </div>
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 13,
          color: colors.textMuted,
          padding: '8px 10px',
          borderRadius: 8,
          background: 'rgba(8, 9, 22, 0.55)',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {path}
      </div>
    </div>
  );
};
